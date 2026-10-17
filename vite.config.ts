import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';
import dotenv from 'dotenv';
import { analyzeKaldikHandler, curriculumAssistantHandler } from './src/server/kaldikAnalyzer';

dotenv.config();

function copy404Plugin(): Plugin {
  return {
    name: 'kaldik-copy-404-plugin',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      const docsDir = path.resolve(__dirname, 'docs');
      const distIndex = path.resolve(distDir, 'index.html');
      const dist404 = path.resolve(distDir, '404.html');

      if (fs.existsSync(distIndex)) {
        fs.copyFileSync(distIndex, dist404);
        console.log('✓ Successfully created dist/404.html for GitHub Pages fallback');
      }

      // Sync dist to docs folder for users deploying via GitHub Pages "Deploy from a branch -> /docs"
      try {
        if (!fs.existsSync(docsDir)) {
          fs.mkdirSync(docsDir, { recursive: true });
        }
        fs.cpSync(distDir, docsDir, { recursive: true, force: true });
        console.log('✓ Successfully synced dist/ to docs/ for GitHub Pages branch deployment');
      } catch (e) {
        console.warn('Note: could not copy to docs folder:', e);
      }
    }
  };
}

function apiPlugin(): Plugin {
  return {
    name: 'kaldik-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        // Buffer request body
        const chunks: Buffer[] = [];
        req.on('data', chunk => {
          chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
        });

        req.on('end', async () => {
          try {
            const rawBody = Buffer.concat(chunks).toString('utf-8');
            const body = rawBody ? JSON.parse(rawBody) : {};

            if (req.url === '/api/analyze-kaldik' && req.method === 'POST') {
              const result = await analyzeKaldikHandler(body);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(result));
              return;
            }

            if (req.url === '/api/curriculum-assistant' && req.method === 'POST') {
              const result = await curriculumAssistantHandler(body);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(result));
              return;
            }

            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Endpoint not found' }));
          } catch (err: any) {
            console.error('API Error in vite middleware:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
          }
        });
      });
    }
  };
}

export default defineConfig(() => {
  return {
    base: './',
    plugins: [react(), tailwindcss(), apiPlugin(), copy404Plugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
