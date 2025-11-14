const REALTIME_MODEL = 'gpt-4o-realtime-preview-2024-12-17';

const ui = {
  fileInput: document.getElementById('file-input'),
  loadTestButton: document.getElementById('load-test-btn'),
  clearTextButton: document.getElementById('clear-text-btn'),
  textInput: document.getElementById('text-input'),
  voiceSelect: document.getElementById('voice-select'),
  chunkSizeInput: document.getElementById('chunk-size'),
  chunkLimitInput: document.getElementById('chunk-limit'),
  autoContinueSelect: document.getElementById('auto-continue'),
  connectButton: document.getElementById('connect-btn'),
  nextChunkButton: document.getElementById('next-chunk-btn'),
  stopButton: document.getElementById('stop-btn'),
  statusText: document.getElementById('status-text'),
  progressText: document.getElementById('progress-text'),
  transcript: document.getElementById('transcript'),
  audio: document.getElementById('audio-player'),
  log: document.getElementById('log'),
  lastEvent: document.getElementById('last-event'),
};

const state = {
  pc: null,
  dataChannel: null,
  session: null,
  queue: [],
  activeChunk: null,
  completedCount: 0,
  totalChunks: 0,
  autoContinue: true,
  transcriptBuffer: '',
  isConnecting: false,
  isConnected: false,
  pendingResponseId: null,
  abortController: null,
};

function appendLog(message, level = 'info') {
  if (!ui.log) return;
  const entry = document.createElement('div');
  entry.className = `log-entry ${level}`;
  entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
  ui.log.appendChild(entry);
  ui.log.scrollTop = ui.log.scrollHeight;
}

function clearTranscript() {
  state.transcriptBuffer = '';
  ui.transcript.value = '';
}

function setStatus(text) {
  if (ui.statusText) ui.statusText.textContent = text;
  appendLog(text, 'info');
}

function setLastEvent(text) {
  if (ui.lastEvent) ui.lastEvent.textContent = text;
}

function updateProgress(extraInFlight = false) {
  const total = state.totalChunks;
  const completedBase = state.completedCount;
  const completed = Math.min(total, completedBase + (extraInFlight ? 1 : 0));
  if (ui.progressText) {
    ui.progressText.textContent = `${completed} / ${total}`;
  }
}

function setButtons({ connecting = false, connected = false, hasQueue = false, awaitingChunk = false }) {
  ui.connectButton.disabled = connecting || connected;
  ui.stopButton.disabled = !connected;
  const manualMode = !state.autoContinue;
  ui.nextChunkButton.disabled = !connected || !manualMode || (!awaitingChunk && !hasQueue);
}

function prepareChunks(text, chunkSize, limit) {
  const sanitized = text.replace(/\r\n/g, '\n').replace(/\u0000/g, '').trim();
  const chunks = [];
  let pointer = 0;
  let index = 1;
  const maxChunks = Math.max(1, limit);

  while (pointer < sanitized.length && chunks.length < maxChunks) {
    const remaining = sanitized.length - pointer;
    let take = Math.min(chunkSize, remaining);

    if (pointer + take < sanitized.length) {
      const slice = sanitized.slice(pointer, pointer + take);
      const boundary = Math.max(
        slice.lastIndexOf('\n\n'),
        slice.lastIndexOf('. '),
        slice.lastIndexOf('? '),
        slice.lastIndexOf('! '),
        slice.lastIndexOf('; '),
        slice.lastIndexOf(': '),
        slice.lastIndexOf(' ')
      );
      if (boundary > chunkSize * 0.5) {
        take = boundary + pointer + 1 - pointer;
      }
    }

    const chunk = sanitized.slice(pointer, pointer + take).trim();
    if (chunk.length) {
      chunks.push({
        id: `chunk-${index}`,
        index,
        text: chunk,
      });
      index += 1;
    }

    pointer += take;
  }

  return chunks;
}

function resetConnection(reason = 'idle') {
  if (state.dataChannel) {
    try {
      state.dataChannel.close();
    } catch (err) {
      console.error('Error closing data channel', err);
    }
  }
  if (state.pc) {
    try {
      state.pc.close();
    } catch (err) {
      console.error('Error closing RTCPeerConnection', err);
    }
  }
  if (state.abortController) {
    state.abortController.abort();
    state.abortController = null;
  }
  state.pc = null;
  state.dataChannel = null;
  state.session = null;
  state.activeChunk = null;
  state.pendingResponseId = null;
  state.isConnecting = false;
  state.isConnected = false;
  state.totalChunks = 0;
  setButtons({ connecting: false, connected: false, hasQueue: false });
  setStatus(`Connection closed (${reason})`);
}

function ensureAudioPlayback() {
  if (!ui.audio) return;
  ui.audio.autoplay = true;
  const promise = ui.audio.play();
  if (promise) {
    promise.catch(() => {
      appendLog('Audio playback is blocked. Press play on the audio element.', 'error');
    });
  }
}

function handleDataChannelMessage(event) {
  if (typeof event.data !== 'string') {
    appendLog('Received non-text message on data channel', 'info');
    return;
  }

  try {
    const message = JSON.parse(event.data);
    const { type } = message;
    if (!type) return;

    setLastEvent(type);

    switch (type) {
      case 'session.updated':
        appendLog('Session updated', 'success');
        break;
      case 'response.created':
        state.pendingResponseId = message.response?.id ?? null;
        appendLog(`Response created (${state.pendingResponseId ?? 'unknown id'})`, 'success');
        break;
      case 'response.output_text.delta': {
        const delta = message.delta ?? '';
        if (delta) {
          state.transcriptBuffer += delta;
          const maxLen = 4000;
          if (state.transcriptBuffer.length > maxLen) {
            state.transcriptBuffer = state.transcriptBuffer.slice(-maxLen);
          }
          ui.transcript.value = state.transcriptBuffer;
          ui.transcript.scrollTop = ui.transcript.scrollHeight;
        }
        break;
      }
      case 'response.output_text.done':
        state.transcriptBuffer += '\n';
        break;
      case 'response.refusal':
      case 'response.error':
      case 'error':
        appendLog(
          `Realtime API error: ${message.error?.message || message.reason || JSON.stringify(message)}`,
          'error'
        );
        break;
      case 'response.completed': {
        const responseId = message.response?.id;
        if (state.activeChunk && (!responseId || responseId === state.pendingResponseId)) {
          state.completedCount += 1;
          appendLog(`Finished chunk ${state.activeChunk.index}`, 'success');
          state.activeChunk = null;
          state.pendingResponseId = null;
          updateProgress();
          if (state.autoContinue) {
            sendNextChunk();
          } else {
            setStatus('Awaiting manual chunk dispatch');
            setButtons({ connected: state.isConnected, hasQueue: state.queue.length > 0, awaitingChunk: true });
          }
        }
        break;
      }
      case 'response.failed': {
        appendLog(`Chunk failed: ${message.error?.message || 'unknown error'}`, 'error');
        state.activeChunk = null;
        state.pendingResponseId = null;
        if (!state.autoContinue) {
          setButtons({ connected: state.isConnected, hasQueue: state.queue.length > 0, awaitingChunk: true });
        }
        break;
      }
      default:
        break;
    }
  } catch (err) {
    appendLog(`Failed to parse channel message: ${err.message}`, 'error');
  }
}

async function waitForIceCompletion(pc) {
  if (pc.iceGatheringState === 'complete') return;
  await new Promise((resolve) => {
    const checkState = () => {
      if (pc.iceGatheringState === 'complete') {
        pc.removeEventListener('icegatheringstatechange', checkState);
        resolve();
      }
    };
    pc.addEventListener('icegatheringstatechange', checkState);
  });
}

async function createRealtimeConnection(voice) {
  state.isConnecting = true;
  setButtons({ connecting: true });

  const response = await fetch('/api/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ voice }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create session: ${errorText}`);
  }

  const session = await response.json();
  state.session = session;

  const iceServers = Array.isArray(session.ice_servers) ? session.ice_servers : [];
  state.pc = new RTCPeerConnection({ iceServers });

  state.pc.addEventListener('track', (event) => {
    if (ui.audio) {
      ui.audio.srcObject = event.streams[0];
      ensureAudioPlayback();
    }
  });

  state.pc.addEventListener('connectionstatechange', () => {
    appendLog(`Peer connection state: ${state.pc.connectionState}`, 'info');
    if (['failed', 'disconnected', 'closed'].includes(state.pc.connectionState)) {
      resetConnection(state.pc.connectionState);
    }
  });

  state.pc.addEventListener('iceconnectionstatechange', () => {
    appendLog(`ICE connection state: ${state.pc.iceConnectionState}`, 'info');
  });

  state.pc.addEventListener('icegatheringstatechange', () => {
    appendLog(`ICE gathering state: ${state.pc.iceGatheringState}`, 'info');
  });

  state.dataChannel = state.pc.createDataChannel('oai-events');
  state.dataChannel.addEventListener('open', () => {
    state.isConnecting = false;
    state.isConnected = true;
    appendLog('Realtime control channel open', 'success');
    setStatus('Connected to Realtime API');
    setButtons({ connected: true, hasQueue: state.queue.length > 0 });
    if (state.autoContinue) {
      sendNextChunk();
    } else {
      setButtons({ connected: true, hasQueue: state.queue.length > 0, awaitingChunk: true });
    }
  });
  state.dataChannel.addEventListener('message', handleDataChannelMessage);
  state.dataChannel.addEventListener('close', () => {
    appendLog('Data channel closed', 'info');
  });
  state.dataChannel.addEventListener('error', (err) => {
    appendLog(`Data channel error: ${err.message}`, 'error');
  });

  const offer = await state.pc.createOffer();
  await state.pc.setLocalDescription(offer);
  await waitForIceCompletion(state.pc);

  const localSdp = state.pc.localDescription?.sdp;
  if (!localSdp) {
    throw new Error('Missing local SDP');
  }

  const clientSecret = session?.client_secret?.value;
  if (!clientSecret) {
    throw new Error('Missing client secret in session response.');
  }

  const realtimeUrl = `https://api.openai.com/v1/realtime?model=${encodeURIComponent(REALTIME_MODEL)}`;

  state.abortController = new AbortController();
  const sdpResponse = await fetch(realtimeUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${clientSecret}`,
      'Content-Type': 'application/sdp',
      'OpenAI-Beta': 'realtime=v1',
    },
    body: localSdp,
    signal: state.abortController.signal,
  });

  if (!sdpResponse.ok) {
    const errorText = await sdpResponse.text();
    throw new Error(`Realtime SDP exchange failed: ${errorText}`);
  }

  const answerSdp = await sdpResponse.text();
  const remoteDesc = { type: 'answer', sdp: answerSdp };
  await state.pc.setRemoteDescription(remoteDesc);

  setStatus('Realtime session ready');
}

function buildNarrationPrompt(chunk, chunkNumber, totalChunks) {
  return [
    {
      type: 'input_text',
      text: `Narrate the following excerpt from William Gibson's "Neuromancer". Adopt a measured sci-fi noir tone, stay faithful to the text, and do not add commentary. Excerpt ${chunkNumber} of ${totalChunks}:`,
    },
    {
      type: 'input_text',
      text: chunk.text,
    },
  ];
}

function sendNextChunk() {
  if (!state.dataChannel || state.dataChannel.readyState !== 'open') {
    appendLog('Data channel is not ready to send chunks.', 'error');
    return;
  }

  if (state.activeChunk) {
    appendLog(`Chunk ${state.activeChunk.index} already in flight, waiting completion`, 'info');
    return;
  }

  if (!state.queue.length) {
    setStatus('Narration complete — no more chunks queued.');
    setButtons({ connected: state.isConnected, hasQueue: false, awaitingChunk: false });
    return;
  }

  const nextChunk = state.queue.shift();
  state.activeChunk = nextChunk;
  appendLog(`Sending chunk ${nextChunk.index}`, 'info');

  const payload = {
    type: 'response.create',
    response: {
      modalities: ['audio'],
      audio: {
        voice: ui.voiceSelect.value || 'verse',
        format: 'wav',
      },
      instructions: 'Read the supplied text with clear diction and consistent pacing.',
      content: buildNarrationPrompt(nextChunk, nextChunk.index, state.totalChunks),
    },
  };

  try {
    state.dataChannel.send(JSON.stringify(payload));
    setStatus(`Chunk ${nextChunk.index} dispatched`);
    updateProgress(true);
    setButtons({ connected: state.isConnected, hasQueue: state.queue.length > 0, awaitingChunk: false });
  } catch (error) {
    appendLog(`Failed to send chunk ${nextChunk.index}: ${error.message}`, 'error');
    state.activeChunk = null;
    state.pendingResponseId = null;
  }
}

async function startNarration() {
  if (state.isConnecting || state.isConnected) {
    appendLog('Narration already running.', 'info');
    return;
  }

  const rawText = ui.textInput.value.trim();
  if (!rawText) {
    appendLog('Please provide text to narrate.', 'error');
    return;
  }

  clearTranscript();
  appendLog('Preparing chunks…', 'info');

  const chunkSize = Number.parseInt(ui.chunkSizeInput.value, 10) || 1400;
  const chunkLimit = Number.parseInt(ui.chunkLimitInput.value, 10) || 6;
  state.autoContinue = ui.autoContinueSelect.value === 'true';

  const chunks = prepareChunks(rawText, chunkSize, chunkLimit);
  if (!chunks.length) {
    appendLog('The selected text is too small after chunking.', 'error');
    return;
  }

  state.queue = chunks;
  state.completedCount = 0;
  state.totalChunks = chunks.length;
  state.pendingResponseId = null;
  setStatus(`Prepared ${chunks.length} chunk(s)`);
  updateProgress();

  try {
    await createRealtimeConnection(ui.voiceSelect.value || 'verse');
  } catch (error) {
    appendLog(`Failed to start narration: ${error.message}`, 'error');
    resetConnection('error');
  }
}

function stopNarration() {
  resetConnection('stopped');
}

async function loadTestFile() {
  appendLog('Loading bundled 10 MB test file…', 'info');
  const response = await fetch('/testdata/repeated-10mb.txt');
  if (!response.ok) {
    appendLog(`Failed to load test file: ${response.statusText}`, 'error');
    return;
  }
  const text = await response.text();
  ui.textInput.value = text;
  appendLog('Test file loaded into the editor.', 'success');
}

function clearInputs() {
  ui.textInput.value = '';
  ui.fileInput.value = '';
  clearTranscript();
  appendLog('Cleared text input.', 'info');
}

function handleFileInput(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  if (file.size > 25 * 1024 * 1024) {
    appendLog('File too large; please use a file under 25 MB.', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    ui.textInput.value = typeof e.target?.result === 'string' ? e.target.result : '';
    appendLog(`Loaded ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB).`, 'success');
  };
  reader.onerror = () => {
    appendLog(`Failed to read file: ${reader.error?.message ?? 'Unknown error'}`, 'error');
  };
  reader.readAsText(file);
}

ui.connectButton?.addEventListener('click', startNarration);
ui.stopButton?.addEventListener('click', stopNarration);
ui.loadTestButton?.addEventListener('click', loadTestFile);
ui.clearTextButton?.addEventListener('click', clearInputs);
ui.fileInput?.addEventListener('change', handleFileInput);
ui.nextChunkButton?.addEventListener('click', () => sendNextChunk());
ui.autoContinueSelect?.addEventListener('change', () => {
  state.autoContinue = ui.autoContinueSelect.value === 'true';
  setButtons({
    connected: state.isConnected,
    hasQueue: state.queue.length > 0,
    awaitingChunk: !state.autoContinue,
  });
});

window.addEventListener('beforeunload', () => {
  if (state.pc) {
    resetConnection('page-unload');
  }
});

appendLog('Neuromancer realtime narrator ready.', 'success');
