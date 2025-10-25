import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { createServer } from 'http';
import rateLimit from 'express-rate-limit';
import { DatabaseConfig } from './config/database';
import { WebSocketServer } from './infra/websocket/WebSocketServer';
import authRoutes from './interfaces/routes/authRoutes';
import questionRoutes from './interfaces/routes/questionRoutes';
import answerRoutes from './interfaces/routes/answerRoutes';
import scoreRoutes from './interfaces/routes/scoreRoutes';
import adminRoutes from './interfaces/routes/adminRoutes';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requisições por IP
  message: 'Too many requests from this IP, please try again later.',
});

// Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/', limiter);

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Halloween Quiz API',
      version: '1.0.0',
      description: 'API para aplicação de perguntas e respostas temática de Halloween',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/interfaces/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get('/healthz', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/answers', answerRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// WebSocket instance (global)
let wsServer: WebSocketServer;

// Start server
const startServer = async (): Promise<void> => {
  try {
    // Connect to database
    await DatabaseConfig.connect();

    // Initialize WebSocket
    wsServer = new WebSocketServer(httpServer);

    // Start listening
    httpServer.listen(PORT, () => {
      console.log(`🎃 Halloween Quiz API running on port ${PORT}`);
      console.log(`📚 Swagger docs available at http://localhost:${PORT}/api-docs`);
      console.log(`❤️  Health check at http://localhost:${PORT}/healthz`);
      console.log(`🔌 WebSocket server ready`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Export WebSocket server for use in controllers
export const getWebSocketServer = (): WebSocketServer => wsServer;

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await DatabaseConfig.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await DatabaseConfig.disconnect();
  process.exit(0);
});

startServer();
