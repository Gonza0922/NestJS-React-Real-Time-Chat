import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  user_ID: number;
  @Column()
  name: string;
  @Column()
  email: string;
  @Column()
  password: string;
}
