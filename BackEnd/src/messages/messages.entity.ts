import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'messages' })
export class Message {
  @PrimaryGeneratedColumn()
  message_ID: number;
  @Column()
  person: string;
  @Column()
  content: string;
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @Column()
  receiver: string;
}
