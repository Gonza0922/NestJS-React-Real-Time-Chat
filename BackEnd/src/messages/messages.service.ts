import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './messages.entity';
import { Repository } from 'typeorm';
import { CreateMessageDto, person } from './messages.dto';
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
  async getMessagesByReceiver(authName: person, receiver: string) {
    // el body es el enviador y param es el recibidor
    const user = await this.usersService.getUserByPassword(authName.person);
    return this.messageRespository.find({
      where: [
        { person: user.name, receiver },
        { person: receiver, receiver: user.name },
      ],
    });
  }
  postMessage(message: CreateMessageDto) {
    const newMessage = this.messageRespository.create(message);
    return this.messageRespository.save(newMessage);
  }
}
