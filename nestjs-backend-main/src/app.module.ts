import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://itsusamasani:UsWpOiynsFz7njew@usamasani.cu5hc8n.mongodb.net/crud',
    ),
    //  MongooseModule.forRoot('mongodb+srv://usaidmalik455:gTZBd11o431qhUGP@cluster0.ansuc.mongodb.net/nest-crud'),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
