import { themes, getThemeById } from '/workspace/src/data.mjs';

const state = {
  themeId: themes[0]?.id,
  wordIndex: 0,
  isPlaying: false,
  secondsPerWord: 1.2,
  autoAdvanceTheme: true,
  timerId: null,
  currentBufferEl: 'a' // alterna entre 'a' e 'b' para animação
};

// Elements
const selectTheme = document.getElementById('select-theme');
const btnPrevTheme = document.getElementById('btn-prev-theme');
const btnNextTheme = document.getElementById('btn-next-theme');
const btnPrevWord = document.getElementById('btn-prev-word');
const btnNextWord = document.getElementById('btn-next-word');
const btnPlay = document.getElementById('btn-play');
const btnPause = document.getElementById('btn-pause');
const speedRange = document.getElementById('speed-range');
const speedValue = document.getElementById('speed-value');
const autoAdvanceCheckbox = document.getElementById('auto-advance-theme');
const themeTitle = document.getElementById('theme-title');
const wordA = document.getElementById('word-a');
const wordB = document.getElementById('word-b');
const printRoot = document.getElementById('print-root');
const btnExportPdf = document.getElementById('btn-export-pdf');
const btnPrint = document.getElementById('btn-print');

function init() {
  // popular temas
  for (const theme of themes) {
    const option = document.createElement('option');
    option.value = theme.id;
    option.textContent = `${theme.name} (${theme.words.length})`;
    selectTheme.appendChild(option);
  }
  selectTheme.value = state.themeId;

  // bind events
  selectTheme.addEventListener('change', () => {
    setTheme(selectTheme.value);
  });
  btnPrevTheme.addEventListener('click', () => gotoAdjacentTheme(-1));
  btnNextTheme.addEventListener('click', () => gotoAdjacentTheme(1));
  btnPrevWord.addEventListener('click', () => stepWord(-1));
  btnNextWord.addEventListener('click', () => stepWord(1));
  btnPlay.addEventListener('click', play);
  btnPause.addEventListener('click', pause);
  speedRange.addEventListener('input', onChangeSpeed);
  autoAdvanceCheckbox.addEventListener('change', () => {
    state.autoAdvanceTheme = autoAdvanceCheckbox.checked;
  });
  btnExportPdf.addEventListener('click', onExportPdf);
  btnPrint.addEventListener('click', () => window.print());

  document.addEventListener('keydown', onKeydown);

  // render inicial
  updateSpeedDisplay();
  renderThemeAndWord();

  // preparar páginas de impressão
  renderPrintPages();
}

function setTheme(themeId) {
  state.themeId = themeId;
  state.wordIndex = 0;
  renderThemeAndWord();
}

function gotoAdjacentTheme(direction) {
  const idx = themes.findIndex(t => t.id === state.themeId);
  const nextIdx = (idx + direction + themes.length) % themes.length;
  selectTheme.value = themes[nextIdx].id;
  setTheme(themes[nextIdx].id);
}

function onChangeSpeed() {
  state.secondsPerWord = Number(speedRange.value);
  updateSpeedDisplay();
  if (state.isPlaying) {
    // reinicia o timer com a nova velocidade
    pause();
    play();
  }
}

function updateSpeedDisplay() {
  speedValue.textContent = state.secondsPerWord.toFixed(1);
}

function stepWord(direction) {
  const theme = getThemeById(state.themeId);
  const total = theme.words.length;
  state.wordIndex = (state.wordIndex + direction + total) % total;
  renderWord();
}

function play() {
  if (state.isPlaying) return;
  state.isPlaying = true;
  btnPlay.disabled = true;
  btnPause.disabled = false;

  const tick = () => {
    stepWord(1);
    const theme = getThemeById(state.themeId);
    if (state.wordIndex === 0) {
      // voltamos ao início, avançar tema se habilitado
      if (state.autoAdvanceTheme) {
        gotoAdjacentTheme(1);
      }
    }
    schedule();
  };

  const schedule = () => {
    clearTimeout(state.timerId);
    state.timerId = setTimeout(tick, state.secondsPerWord * 1000);
  };

  schedule();
}

function pause() {
  state.isPlaying = false;
  btnPlay.disabled = false;
  btnPause.disabled = true;
  clearTimeout(state.timerId);
}

function onKeydown(e) {
  if (e.code === 'Space') {
    e.preventDefault();
    state.isPlaying ? pause() : play();
  } else if (e.key === 'ArrowRight') {
    stepWord(1);
  } else if (e.key === 'ArrowLeft') {
    stepWord(-1);
  } else if (e.key === 'ArrowUp') {
    gotoAdjacentTheme(-1);
  } else if (e.key === 'ArrowDown') {
    gotoAdjacentTheme(1);
  }
}

function renderThemeAndWord() {
  const theme = getThemeById(state.themeId);
  themeTitle.textContent = theme.name;
  renderWord(true);
}

function renderWord(reset) {
  const theme = getThemeById(state.themeId);
  const nextWord = theme.words[state.wordIndex] || '';
  // alterna buffers para transição
  const showA = state.currentBufferEl === 'a';
  const entering = showA ? wordA : wordB;
  const exiting = showA ? wordB : wordA;
  entering.textContent = nextWord;
  entering.classList.add('visible');
  exiting.classList.remove('visible');
  state.currentBufferEl = showA ? 'b' : 'a';

  if (reset) {
    // força visibilidade imediata sem transição dupla no primeiro render
    wordA.textContent = nextWord;
    wordA.classList.add('visible');
    wordB.classList.remove('visible');
    state.currentBufferEl = 'b';
  }
}

function renderPrintPages() {
  printRoot.innerHTML = '';
  for (const theme of themes) {
    const page = document.createElement('section');
    page.className = 'print-page';

    const title = document.createElement('h2');
    title.className = 'print-title';
    title.textContent = `Tema: ${theme.name}`;
    page.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'print-grid';
    for (const word of theme.words) {
      const chip = document.createElement('div');
      chip.className = 'print-word';
      chip.textContent = word;
      grid.appendChild(chip);
    }
    page.appendChild(grid);

    printRoot.appendChild(page);
  }
}

async function onExportPdf() {
  // Usa jspdf para gerar um PDF A4, uma página por tema
  const { jsPDF } = window.jspdf || {};
  if (!jsPDF) {
    alert('Biblioteca jsPDF não carregada. Tente usar a impressão do navegador.');
    return;
  }

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const left = 16; // mm
  const top = 18; // mm
  const right = 16; // mm
  const pageWidth = 210;
  const contentWidth = pageWidth - left - right;

  const titleFontSize = 18; // pt
  const wordFontSize = 12; // pt
  const colGap = 6; // mm
  const cols = 3;
  const chipPaddingY = 2.2; // mm approx for 12pt
  const chipPaddingX = 2.6; // mm
  const rowGap = 3.8; // mm

  for (let tIndex = 0; tIndex < themes.length; tIndex++) {
    const theme = themes[tIndex];
    if (tIndex > 0) doc.addPage();

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(titleFontSize);
    doc.text(`Tema: ${theme.name}`, left, top);

    // layout de grid simples
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(wordFontSize);

    const usableTop = top + 10; // abaixo do título
    const colWidth = (contentWidth - (colGap * (cols - 1))) / cols;
    let x = left;
    let y = usableTop;
    let col = 0;

    for (const word of theme.words) {
      const textLines = doc.splitTextToSize(word, colWidth - chipPaddingX * 2);
      const lineHeight = 5; // mm approx for 12pt
      const chipHeight = textLines.length * lineHeight + chipPaddingY * 2;

      // borda do chip
      doc.setDrawColor(210, 218, 226);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(x, y, colWidth, chipHeight, 2, 2, 'FD');
      // texto
      doc.setTextColor(20, 20, 20);
      doc.text(textLines, x + chipPaddingX, y + chipPaddingY + 3.5);

      y += chipHeight + rowGap;
      // quebra de coluna se passar do rodapé
      if (y > 287 /* page height - margin */) {
        col += 1;
        if (col >= cols) {
          // nova página se exceder colunas
          doc.addPage();
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(titleFontSize);
          doc.text(`Tema: ${theme.name}`, left, top);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(wordFontSize);
          col = 0; x = left; y = usableTop;
        } else {
          x = left + col * (colWidth + colGap);
          y = usableTop;
        }
      }
    }
  }

  doc.save('mapa-de-rimas.pdf');
}

// inicializar
init();

