import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import rateLimit from 'express-rate-limit';
import { DatabaseConfig } from '../src/config/database';
import authRoutes from '../src/interfaces/routes/authRoutes';
import questionRoutes from '../src/interfaces/routes/questionRoutes';
import answerRoutes from '../src/interfaces/routes/answerRoutes';
import scoreRoutes from '../src/interfaces/routes/scoreRoutes';
import adminRoutes from '../src/interfaces/routes/adminRoutes';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(limiter);

// Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Halloween Quiz API',
      version: '1.0.0',
      description: 'API para sistema de perguntas e respostas temático de Halloween',
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3000',
        description: 'API Server',
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

// Conectar ao banco de dados
DatabaseConfig.connect()
  .then(() => {
    console.log('✅ Database connected successfully');
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error);
  });

// Export para Vercel
export default app;
