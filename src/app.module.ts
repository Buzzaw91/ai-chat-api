import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mariadb',
        host: process.env.MYSQL_HOST,
        port: 3306,
        username: process.env.MYSQL_USER,
        password: process.env.MYSQL_PWD,
        database: process.env.MYSQL_DATABASE,
        entities: [__dirname + '/**/**/**.entity{.ts,.js}'],
        synchronize: true,
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        cli: {
          migrationsDir: __dirname + '/migrations',
        },
        charset: 'utf8mb4',
        migrationsRun: true,
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
