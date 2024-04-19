import { Module } from '@nestjs/common';
import { WebSocketsModule } from './websockets/websockets.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

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
      entities: [__dirname + '/**/*.entity{.ts,.js}'], //*TODO nuestra ruta + /carpeta/archuvo.entity.ts o js lo crea como tabla
      synchronize: true,
    }),
    WebSocketsModule,
  ],
})
export class AppModule {}
