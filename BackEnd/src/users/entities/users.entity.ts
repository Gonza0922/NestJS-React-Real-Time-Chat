import { Message } from 'src/messages/entities/messages.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  @OneToMany(() => Message, (message) => message.sender)
  user_ID: number;
  @Column()
  name: string;
  @Column()
  email: string;
  @Column()
  password: string;
  @Column()
  image: string;
}
