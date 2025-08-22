import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: (requestOrigin, callback) => {
      const allowedOrigin = process.env.CLIENT_URL as string;
      if (!allowedOrigin || requestOrigin === allowedOrigin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  },
})
export class AppGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('project_invalidation')
  projectInvalidation(
    client: Socket,
    payload: { members: string[]; project_id: number },
  ) {
    if (!payload?.members?.length && !payload?.project_id) {
      return;
    }

    const onlineMembers = payload.members.filter((member) => {
      return this.server.sockets.sockets.get(member);
    });

    this.server
      .to(onlineMembers)
      .except(client.id)
      .emit('project_invalidation', String(payload?.project_id));
  }

  @SubscribeMessage('projects_list_invalidation')
  projectsListInvalidation(
    client: Socket,
    payload: { members: string[]; team_id: number },
  ) {
    if (!payload?.members?.length && !payload?.team_id) {
      return;
    }

    const onlineMembers = payload.members.filter((member) => {
      return this.server.sockets.sockets.get(member);
    });

    this.server
      .to(onlineMembers)
      .except(client.id)
      .emit('projects_list_invalidation', String(payload.team_id));
  }
}
