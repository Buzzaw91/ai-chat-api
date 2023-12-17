import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import helmet from 'helmet'
import * as dotenv from 'dotenv'
import * as cookieParser from 'cookie-parser'
import { readFileSync } from 'fs'

dotenv.config()

async function bootstrap() {
  const httpsOptions = {
    key: readFileSync('server.key'),
    cert: readFileSync('server.cert'),
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
