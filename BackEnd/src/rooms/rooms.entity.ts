import { User } from 'src/users/users.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'rooms' })
export class Room {
  @PrimaryGeneratedColumn()
  room_ID: number;
  @Column()
  name: string;
  @ManyToOne(() => User, (user) => user.user_ID)
  creator: number;
  @ManyToOne(() => User, (user) => user.user_ID)
  member: number;
}