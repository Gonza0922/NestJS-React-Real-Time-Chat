import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto, sender } from './messages.dto';

@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}
  @Get('/getAll')
  getAllMessagesEndpoint() {
    return this.messagesService.getAllMessages();
  }
  @Post('/post/:receiver')
  getMessagesByReceiverEndpoint(
    @Body() authName: sender,
    @Param() param: object,
  ) {
    // el body es el enviador y param es el recibidor
    return this.messagesService.getMessagesByReceiver(
      authName,
      param['receiver'],
    );
  }
  @Post('/post')
  createMessageEndpoint(@Body() newMessage: CreateMessageDto) {
    return this.messagesService.postMessage(newMessage);
  }
}
