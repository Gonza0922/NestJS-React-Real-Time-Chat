import { Module } from '@nestjs/common';
import { WebSocketsModule } from './websockets/websockets.module';

@Module({
    imports: [WebSocketsModule]
})
export class AppModule {}
