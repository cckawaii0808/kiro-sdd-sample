import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { apiReference } from '@scalar/express-api-reference';
import authRoutes from './routes/auth';
import calculatorRoutes from './routes/calculator';
import { swaggerSpec } from './swagger';
import projectConfig from '../../project.config.json';

dotenv.config();

const app = express();
const PORT = process.env.PORT || projectConfig.backend.port;

// Middleware
app.use(cors());
app.use(express.json());

// API Documentation
app.use(
  '/api-docs',
  apiReference({
    spec: {
      content: swaggerSpec,
    },
  })
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/calculator', calculatorRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
