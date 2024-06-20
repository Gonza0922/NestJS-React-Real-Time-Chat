import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto, finalReceiverDto } from './dto/messages.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}
  @Get('/getAll')
  getAllMessagesEndpoint(@Request() req: Request) {
    return this.messagesService.getAllMessages(req);
  }
  @Post('/getByReceiver')
  getMessagesByReceiverEndpoint(
    @Body() finalReceiver: finalReceiverDto,
    @Request() req: Request,
  ) {
    return this.messagesService.getMessagesByReceiver(req, finalReceiver);
  }
  @Post('/post')
  createMessageEndpoint(@Body() newMessage: CreateMessageDto) {
    return this.messagesService.postMessage(newMessage);
  }
}
