import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './messages.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}
  @Get('/getAll')
  getAllMessages() {
    return this.messagesService.getAllMessages();
  }
  @UseGuards(AuthGuard)
  @Get('/get/:receiver')
  getMessagesReceiver(@Req() req: any, @Param() param: object) {
    // el req es el enviador y param es el recibidor
    return this.messagesService.getMessagesReceiver(
      req.user.user_ID,
      param['receiver'],
    );
  }
  @Post('/post')
  createMessage(@Body() newMessage: CreateMessageDto) {
    return this.messagesService.postMessage(newMessage);
  }
}
