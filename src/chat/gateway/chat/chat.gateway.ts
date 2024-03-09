import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: ['http://localhost:8100']}})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect{
  // @SubscribeMessage('message')
  // handleMessage(client: any, payload: any): string {

  //   return 'Hello world!';
  // }

  @WebSocketServer()
  server: Server ;

  handleConnection() {
    console.log('connection Made')
  }

  handleDisconnect() {
    console.log('disconnected');
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: string): any{
    this.server.emit('newMessage', payload);
  }

}
