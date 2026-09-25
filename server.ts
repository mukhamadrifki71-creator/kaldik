import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyzeKaldikHandler, curriculumAssistantHandler } from './src/server/kaldikAnalyzer';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '30mb' }));

// Endpoint: Analyze Kalender Pendidikan (from text or base64 image/document)
app.post('/api/analyze-kaldik', async (req, res) => {
  try {
    const result = await analyzeKaldikHandler(req.body);
    return res.json(result);
  } catch (error: any) {
    console.error('Error analyzing kaldik:', error);
    return res.status(500).json({ error: error.message || 'Gagal menganalisis kalender pendidikan' });
  }
});

// Endpoint: AI Curriculum Assistant & Optimization
app.post('/api/curriculum-assistant', async (req, res) => {
  try {
    const result = await curriculumAssistantHandler(req.body);
    return res.json(result);
  } catch (error: any) {
    console.error('Error in curriculum assistant:', error);
    return res.status(500).json({ error: error.message || 'Gagal memproses bantuan kurikulum' });
  }
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});
