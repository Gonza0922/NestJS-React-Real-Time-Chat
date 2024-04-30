import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './messages.entity';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './messages.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private messageRespository: Repository<Message>,
    private usersService: UsersService,
  ) {}
  getAllMessages() {
    return this.messageRespository.find();
  }
  async getMessagesReceiver(user_ID: number, receiver: string) {
    // el req es el enviador y param es el recibidor
    const findUser = await this.usersService.getUser(user_ID);
    return this.messageRespository.find({
      where: { person: findUser.name, receiver },
    });
  }
  postMessage(message: CreateMessageDto) {
    const newMessage = this.messageRespository.create(message);
    return this.messageRespository.save(newMessage);
  }
}
