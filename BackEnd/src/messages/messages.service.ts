import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './messages.entity';
import { Repository } from 'typeorm';
import { CreateMessageDto, finalReceiverDto } from './messages.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    private usersService: UsersService,
  ) {}

  getAllMessages() {
    try {
      return this.messageRepository.find({ relations: ['sender'] });
    } catch (e) {
      console.error(e);
      throw new HttpException(
        'Error recovering all messages',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getMessagesByReceiver(authName: string, receiver: finalReceiverDto) {
    try {
      if (typeof receiver.data === 'object') {
        return await this.messageRepository.find({
          relations: ['sender'],
          where: { receiverName: receiver.name },
        });
      } else {
        const user = await this.usersService.getUserByPassword(authName);
        if (!user)
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        const receiverUser = await this.usersService.getUserByName(
          receiver.name,
        );
        if (!receiverUser)
          throw new HttpException('Receiver not found', HttpStatus.NOT_FOUND);
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
    } catch (e) {
      console.error(e);
      throw new HttpException(
        'Error recovering message by receiver',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  postMessage(newMessage: CreateMessageDto) {
    try {
      const newMessageCreated = this.messageRepository.create(newMessage);
      return this.messageRepository.save(newMessageCreated);
    } catch (e) {
      console.error(e);
      throw new HttpException(
        'Error creating message',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
