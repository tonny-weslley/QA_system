import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { websocketConfig } from '../../config/websocket';
import { JWTService } from '../auth/JWTService';

export class WebSocketServer {
  private io: Server;

  constructor(httpServer: HttpServer) {
    this.io = new Server(httpServer, {
      cors: websocketConfig.cors,
    });

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware(): void {
    // Middleware de autenticação
    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      try {
        const decoded = JWTService.verifyToken(token);
        socket.data.user = decoded;
        next();
      } catch (error) {
        return next(new Error('Authentication error: Invalid token'));
      }
    });
  }

  private setupEventHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      const user = socket.data.user;
      console.log(`✅ User connected: ${user.username} (${user.role})`);

      // Entrar na sala geral
      socket.join('scoreboard');

      // Evento de desconexão
      socket.on('disconnect', () => {
        console.log(`❌ User disconnected: ${user.username}`);
      });

      // Admins podem entrar em salas específicas
      if (user.role === 'admin') {
        socket.join('admin');
      }
    });
  }

  // Métodos para emitir eventos
  public emitScoreboardUpdate(scoreboard: unknown): void {
    this.io.to('scoreboard').emit('scoreboard:update', scoreboard);
  }

  public emitQuestionLocked(questionId: string): void {
    this.io.to('scoreboard').emit('question:locked', { questionId });
  }

  public emitNewAnswer(data: { questionId: string; userId: string; isCorrect: boolean }): void {
    this.io.to('admin').emit('answer:new', data);
  }

  public emitEventFinalized(data: unknown): void {
    this.io.emit('event:finalized', data);
  }

  public getIO(): Server {
    return this.io;
  }
}
