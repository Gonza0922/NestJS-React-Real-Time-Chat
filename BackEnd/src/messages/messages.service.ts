import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './messages.entity';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './messages.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private messageRespository: Repository<Message>,
  ) {}
  getAllMessages() {
    return this.messageRespository.find();
  }
  postMessage(message: CreateMessageDto) {
    const newMessage = this.messageRespository.create(message);
    return this.messageRespository.save(newMessage);
  }
}
