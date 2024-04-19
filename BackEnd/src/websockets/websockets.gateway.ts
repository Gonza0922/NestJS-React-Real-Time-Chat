import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({cors: "http://localhost:5173"})
export class WebSocketsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  handleConnection(client: Socket) {
    console.log(`client connected: ${client.id}`);
  }
  handleDisconnect(client: Socket) {
    console.log(`client disconnected: ${client.id}`);
  }
  @SubscribeMessage("message")
  handleMessage(@ConnectedSocket() client:Socket, @MessageBody() data:string) {
    // const finalData =  {person: client.id.slice(0,6), content: data}
    const finalData =  {person: "Anonimus", content: data}
    console.log(finalData);
    client.broadcast.emit("message", finalData)
  }
}
