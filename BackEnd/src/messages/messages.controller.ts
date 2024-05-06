import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
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
    @Param('receiver') receiver: string,
  ) {
    return this.messagesService.getMessagesByReceiver(authName, receiver);
  }
  @Post('/post')
  createMessageEndpoint(@Body() newMessage: CreateMessageDto) {
    return this.messagesService.postMessage(newMessage);
  }
}
