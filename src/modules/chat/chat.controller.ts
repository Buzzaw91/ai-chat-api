import { Controller, Sse, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'
import { MessageEvent } from '@nestjs/common'

import { ChatService } from './chat.service'

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(AuthGuard('jwt'))
  @Sse('sse')
  sse(): Observable<MessageEvent> {
    return this.chatService.sayHello()
  }
}
