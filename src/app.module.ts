import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesModule } from './roles/roles.module';


@Module({
  imports: [
  UsersModule,
  RolesModule,
  MongooseModule.forRoot('mongodb://localhost/nest'),
  ],
  
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
