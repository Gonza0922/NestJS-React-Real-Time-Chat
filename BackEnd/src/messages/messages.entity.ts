import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from 'src/users/users.entity';

@Entity({ name: 'messages' })
export class Message {
  @PrimaryGeneratedColumn()
  message_ID: number;
  @ManyToOne(() => User, (user) => user.user_ID)
  sender: number;
  @Column()
  content: string;
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @ManyToOne(() => User, (user) => user.user_ID)
  receiver: number;
}
