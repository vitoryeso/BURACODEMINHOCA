import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: '1mb' }));

app.use(express.static(__dirname));

app.post('/api/session', async (req, res) => {
  if (!OPENAI_API_KEY) {
    res.status(500).json({ error: 'OPENAI_API_KEY is not configured on the server.' });
    return;
  }

  const voice = typeof req.body?.voice === 'string' ? req.body.voice : 'verse';

  try {
    const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'realtime=v1',
      },
      body: JSON.stringify({
        model: 'gpt-4o-realtime-preview-2024-12-17',
        voice,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to create realtime session', response.status, errorText);
      res.status(response.status).json({ error: 'Failed to create realtime session', details: errorText });
      return;
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error creating realtime session', error);
    res.status(500).json({ error: 'Unexpected error creating realtime session.' });
  }
});

app.get('/neuromancer', (_req, res) => {
  res.sendFile(path.join(__dirname, 'neuromancer.html'));
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

