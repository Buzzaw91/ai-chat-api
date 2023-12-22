import { Inject, Injectable } from '@nestjs/common'
import { GenerativeModel } from '@google-cloud/vertexai'

@Injectable()
export class ChatService {
  constructor(
    @Inject('GENERATIVE_MODEL')
    private readonly generativeModel: GenerativeModel,
  ) {}

  // async startChatSession() {
  //   const chat = this.generativeModel.startChat()
  //   return chat
  // }

  async sendMessage() {
    const chat = this.generativeModel.startChat({})
    const chatInput1 = 'How can I learn more about Node.js?'

    try {
      const result1 = await chat.sendMessageStream(chatInput1)
      for await (const item of result1.stream) {
        console.log(item.candidates[0].content.parts[0].text)
      }
      console.log(
        'aggregated response: ',
        JSON.stringify(await result1.response),
      )
      return result1.stream
    } catch (error) {
      console.log('error', error)
    }
  }
}
