import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ChatGateway } from './chat.gateway'

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [],
  providers: [ChatGateway],
})
export class ChatModule {}
