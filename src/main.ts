import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import helmet from 'helmet'
import * as dotenv from 'dotenv'
import * as cookieParser from 'cookie-parser'

dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
    cors: {
      origin: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
      credentials: true,
    },
  })

  app.use(cookieParser())
  app.use(helmet())

  await app.listen(3000)
}
bootstrap()
