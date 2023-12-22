import { Injectable } from '@nestjs/common'
import { Observable, interval, map, take } from 'rxjs'
import { MessageEvent } from '@nestjs/common'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class ChatService {
  sayHello(): Observable<MessageEvent> {
    const numberOfMessages = 5

    return interval(1000).pipe(
      take(numberOfMessages), // Take only the first 5 emissions
      map((count) => {
        // Map each emission to a MessageEvent
        return {
          event: 'message',
          id: uuidv4(),
          data: `Message ${count + 1}`,
        }
      }),
    )
  }
}
