import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import config from 'config';
import { ConfigModule } from '@nestjs/config';
import configuration from 'config/configuration';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionFilter } from './httpExceptionFilter';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true, load: [configuration]}),
    MongooseModule.forRoot(config.get('mongodbUrl')),
    UsersModule,
    MailModule
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_FILTER,
    useClass: AllExceptionFilter
  }],
})
export class AppModule {}
