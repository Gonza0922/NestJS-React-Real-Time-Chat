import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './messages.entity';
import { Repository } from 'typeorm';
import { CreateMessageDto, sender } from './messages.dto';
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
  async getMessagesByReceiver(authName: sender, receiver: string) {
    if (receiver !== 'none') {
      const user = await this.usersService.getUserByPassword(authName.sender);
      const receiverUser = await this.usersService.getUserByName(receiver);
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
  postMessage(newMessage: CreateMessageDto) {
    const newMessageCreated = this.messageRepository.create(newMessage);
    return this.messageRepository.save(newMessageCreated);
  }
}
