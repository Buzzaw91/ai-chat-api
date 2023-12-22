import { Controller, UseGuards, Get } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ChatService } from './chat.service'

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('messages')
  @UseGuards(AuthGuard('jwt'))
  messages() {
    return this.chatService.sendMessage()
  }
}
