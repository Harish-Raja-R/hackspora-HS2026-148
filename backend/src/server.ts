import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration to allow local Vite frontend development
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

import path from 'path';
import fs from 'fs';

const frontendDist = fs.existsSync(path.resolve(process.cwd(), 'frontend/dist'))
  ? path.resolve(process.cwd(), 'frontend/dist')
  : path.resolve(process.cwd(), '../frontend/dist');

// Mount API routes
app.use('/api', apiRoutes);

// Static frontend serving in production
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  // Root information fallback endpoint when running in pure API dev mode
  app.get('/', (_req, res) => {
    res.json({
      platform: 'SCAMCHECK — AI Opportunity Intelligence',
      tagline: 'Verify before you trust.',
      status: 'OPERATIONAL',
      apiDocumentation: '/api/health'
    });
  });
}

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred'
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🛡️  SCAMCHECK Backend Engine Active on Port ${PORT}`);
  console.log(`📡 Endpoints: http://localhost:${PORT}/api/investigate`);
  console.log(`🔬 Health:    http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});

export default app;
