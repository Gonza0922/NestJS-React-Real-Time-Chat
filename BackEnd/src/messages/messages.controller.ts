import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto, finalReceiverDto } from './messages.dto';
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
  @UsePipes(new ValidationPipe())
  createMessageEndpoint(@Body() newMessage: CreateMessageDto) {
    return this.messagesService.postMessage(newMessage);
  }
}
