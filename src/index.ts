import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import { config } from 'dotenv';
import { createServer } from 'http';
import { setupRoutes } from './routes';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';
import { logger } from './utils/logger';
import { setupBullBoard } from './utils/bullBoard';
import { initializeRedis } from './services/cacheService';

// Load environment variables
config();

// Initialize Express app
const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3000;
const API_PREFIX = process.env.API_PREFIX || '/api/v1';

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(compression()); // Compress responses
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } })); // HTTP request logging

// Initialize services
initializeRedis().catch(err => {
  logger.error('Failed to initialize Redis:', err);
});

// Setup Bull Dashboard for queue monitoring (development only)
if (process.env.NODE_ENV !== 'production') {
  setupBullBoard(app);
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    version: process.env.APP_VERSION || '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use(API_PREFIX, setupRoutes());

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
httpServer.listen(PORT, () => {
  logger.info(`🚀 Yaadein AI Backend running on port ${PORT}`);
  logger.info(`📚 API Documentation available at ${API_PREFIX}/docs`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  httpServer.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

export default app;