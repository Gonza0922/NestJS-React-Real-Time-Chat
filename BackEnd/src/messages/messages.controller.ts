import { Body, Controller, Get, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './messages.dto';

@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}
  @Get('/getAll')
  getAllMessagesEndpoint() {
    return this.messagesService.getAllMessages();
  }
  @Post('/getByReceiver')
  getMessagesByReceiverEndpoint(
    @Body() data: { authName: string; finalReceiver: any },
  ) {
    return this.messagesService.getMessagesByReceiver(
      data.authName,
      data.finalReceiver,
    );
  }
  @Post('/post')
  createMessageEndpoint(@Body() newMessage: CreateMessageDto) {
    return this.messagesService.postMessage(newMessage);
  }
}
