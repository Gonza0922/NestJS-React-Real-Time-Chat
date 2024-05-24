import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './messages.entity';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './messages.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    private usersService: UsersService,
  ) {}
  getAllMessages() {
    return this.messageRepository.find({ relations: ['sender', 'receiver'] });
  }
  async getMessagesByReceiver(authName: string, receiver: any) {
    if (receiver !== 'none') {
      if (typeof receiver.data === 'object') {
        console.log('es un grupo');
        return await this.messageRepository.find({
          relations: ['sender', 'receiver'],
          where: { receiverName: receiver.name },
        });
      } else {
        console.log('es una persona');
        const user = await this.usersService.getUserByPassword(authName);
        const receiverUser = await this.usersService.getUserByName(
          receiver.name,
        );
        const user1Id = user.user_ID;
        const user2Id = receiverUser.user_ID;
        return await this.messageRepository
          .createQueryBuilder('message')
          .leftJoinAndSelect('message.sender', 'sender')
          .leftJoinAndSelect('message.receiver', 'receiver')
          .where(
            '(message.sender = :user1Id AND message.receiver = :user2Id) OR (message.sender = :user2Id AND message.receiver = :user1Id)',
            { user1Id, user2Id },
          )
          .orderBy('message.message_ID', 'ASC')
          .getMany();
      }
    }
  }
  postMessage(newMessage: CreateMessageDto) {
    const newMessageCreated = this.messageRepository.create(newMessage);
    return this.messageRepository.save(newMessageCreated);
  }
}
