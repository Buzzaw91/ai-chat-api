import { Controller, Sse } from '@nestjs/common'
import { Observable } from 'rxjs'
import { MessageEvent } from '@nestjs/common'

import { ChatService } from './chat.service'

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  @Sse('sse')
  sse(): Observable<MessageEvent> {
    return this.chatService.sayHello()
  }
}
