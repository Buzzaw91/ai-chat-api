import { Module } from '@nestjs/common'
import {
  VertexAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google-cloud/vertexai'
import { ChatController } from './chat.controller'
import { ChatService } from './chat.service'

@Module({
  controllers: [ChatController],
  providers: [
    {
      provide: 'GENERATIVE_MODEL',
      useFactory: () => {
        const project = process.env.GCP_PROJECT
        const location = process.env.GCP_LOCATION
        const vertexAI = new VertexAI({
          project,
          location,
        })
        return vertexAI.preview.getGenerativeModel({
          model: 'gemini-pro',
          safety_settings: [
            {
              category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
              threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
          ],
          generation_config: { max_output_tokens: 256 },
        })
      },
    },
    ChatService,
  ],
  exports: [],
})
export class ChatModule {}
