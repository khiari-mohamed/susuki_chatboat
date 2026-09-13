import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';

export type AdminCrudAction = 'created' | 'updated' | 'deleted';

const allowedOrigins = (process.env.DASHBOARD_URL || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim());
if (process.env.PRODUCTION_DASHBOARD_URL) {
  allowedOrigins.push(process.env.PRODUCTION_DASHBOARD_URL);
}

@WebSocketGateway({
  namespace: '/admin',
  cors: { origin: allowedOrigins, credentials: true },
})
export class AdminGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private readonly logger = new Logger(AdminGateway.name);
  // socket.id -> { email, role } — kept for the "who's online" indicator.
  private readonly connectedUsers = new Map<string, { email: string; role: string }>();

  constructor(private readonly jwt: JwtService) {}

  // Socket.IO connections don't go through the HTTP Guards (JwtAuthGuard),
  // so the handshake is authenticated here explicitly. Client sends the
  // JWT via `io(url, { auth: { token } })`.
  handleConnection(client: Socket) {
    try {
      const token = (client.handshake.auth?.token as string | undefined)?.trim();
      if (!token) throw new Error('Missing token');

      const payload = this.jwt.verify(token) as { email: string; role: string };
      this.connectedUsers.set(client.id, { email: payload.email, role: payload.role });

      this.logger.log(`🟢 Dashboard connected: ${payload.email} (${client.id})`);
      this.broadcastPresence();
    } catch {
      this.logger.warn(`🔴 Rejected unauthenticated socket: ${client.id}`);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    const user = this.connectedUsers.get(client.id);
    this.connectedUsers.delete(client.id);
    if (user) this.logger.log(`⚪ Dashboard disconnected: ${user.email}`);
    this.broadcastPresence();
  }

  private broadcastPresence() {
    const online = [...this.connectedUsers.values()].map((u) => u.email);
    this.server?.emit('presence', { online, count: online.length });
  }

  /** Called by every admin CRUD controller after a successful mutation. */
  broadcast(table: string, action: AdminCrudAction, record: unknown) {
    this.server?.emit('record:changed', {
      table,
      action,
      record,
      at: new Date().toISOString(),
    });
  }
}
