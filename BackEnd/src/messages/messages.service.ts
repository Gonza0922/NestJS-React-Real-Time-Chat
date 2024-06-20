import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/messages.entity';
import { Repository } from 'typeorm';
import { CreateMessageDto, finalReceiverDto } from './dto/messages.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    private usersService: UsersService,
  ) {}

  async getAllMessages(req: Request) {
    try {
      const { user_ID, name } = req['user'];
      const authUserMessages = await this.messageRepository
        .createQueryBuilder('message')
        .leftJoinAndSelect('message.sender', 'sender')
        .where(
          '(message.sender = :user_ID) OR (message.receiverName = :name)',
          { user_ID, name },
        )
        .orderBy('message.message_ID', 'ASC')
        .getMany();
      const authUserRoomsMessages = authUserMessages.filter(
        (element) => element.type === 'room',
      );
      const promises = authUserRoomsMessages.map((message) => {
        if (message.receiverName) {
          return this.messageRepository.find({
            relations: ['sender'],
            where: { receiverName: message.receiverName },
          });
        } else {
          return Promise.resolve(undefined);
        }
      });
      const results = await Promise.all(promises);
      const finalAuthUserRoomsMessages = results
        .filter((result) => result !== undefined)
        .flat();
      const finalAuthUserMessages = authUserMessages.filter(
        (message) =>
          !authUserRoomsMessages.some(
            (authUserRoomsMessage) =>
              authUserRoomsMessage.receiverName === message.receiverName,
          ),
      );
      return [...finalAuthUserMessages, ...finalAuthUserRoomsMessages];
    } catch (error) {
      console.error(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getMessagesByReceiver(req: Request, receiver: finalReceiverDto) {
    try {
      if (typeof receiver.data === 'object') {
        return await this.messageRepository.find({
          relations: ['sender'],
          where: { receiverName: receiver.name },
        });
      } else {
        const user = req['user'];
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
    } catch (error) {
      console.error(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  postMessage(newMessage: CreateMessageDto) {
    try {
      const newMessageCreated = this.messageRepository.create(newMessage);
      return this.messageRepository.save(newMessageCreated);
    } catch (error) {
      console.error(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
