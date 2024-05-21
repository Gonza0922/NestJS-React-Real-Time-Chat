import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MessagesModule } from './messages/messages.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ImagesModule } from './images/images.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { RoomsModule } from './rooms/rooms.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.HOST_DB,
      port: parseInt(process.env.PORT_DB),
      username: process.env.USER_DB,
      password: process.env.PASSWORD_DB,
      database: process.env.NAME_DB,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    MessagesModule,
    UsersModule,
    AuthModule,
    JwtModule.register({
      global: true,
      secret: process.env.TOKEN_SECURE,
      signOptions: { expiresIn: '1d' },
    }),
    CloudinaryModule,
    ImagesModule,
    RoomsModule,
  ],
})
export class AppModule {}
