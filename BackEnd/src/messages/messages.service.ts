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
    return this.messageRepository.find({ relations: ['sender'] });
  }
  async getMessagesByReceiver(authName: string, receiver: any) {
    if (receiver.name !== 'none') {
      if (typeof receiver.data === 'object') {
        return await this.messageRepository.find({
          relations: ['sender'],
          where: { receiverName: receiver.name },
        });
      } else {
        const user = await this.usersService.getUserByPassword(authName);
        const receiverUser = await this.usersService.getUserByName(
          receiver.name,
        );
        const user1Id = user.user_ID;
        const user1Name = user.name;
        const user2Id = receiverUser.user_ID;
        const user2Name = receiver.name;
        return await this.messageRepository
          .createQueryBuilder('message')
          .leftJoinAndSelect('message.sender', 'sender')
          .where(
            '(message.sender = :user1Id AND message.receiverName = :user2Name) OR (message.sender = :user2Id AND message.receiverName = :user1Name)',
            { user1Id, user1Name, user2Id, user2Name },
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
