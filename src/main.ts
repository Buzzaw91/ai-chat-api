import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import helmet from 'helmet'
import * as dotenv from 'dotenv'
import * as cookieParser from 'cookie-parser'

dotenv.config()

async function bootstrap() {
  const httpsOptions = {
    key: process.env.SSL_KEY,
    cert: process.env.SSL_CERT,
  }

  const app = await NestFactory.create(AppModule, {
    httpsOptions,
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
  console.log(`Application is running on: https://localhost:3000`)
}

bootstrap()
