import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesModule } from './roles/roles.module';
import configuration from './config/configuration';
import { ConfigModule } from '@nestjs/config';
// import { AuthModule } from './auth/auth.module';
// import { JwtAuthGuard } from './auth/jwt-auth.guard';
// import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from './users/users.module';
// import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
      load: [configuration],
    }),
    MongooseModule.forRoot(
      `mongodb://${configuration().database.mongo.host}:` +
        `${configuration().database.mongo.port}/${
          configuration().database.mongo.database
        }`,
      { serverSelectionTimeoutMS: 5000 },
    ),
    /* MongooseModule.forRoot(`mongodb://${configuration().database.mongo.username}:` +
      `${configuration().database.mongo.password}@${configuration().database.mongo.host}:` +
      `${configuration().database.mongo.port}/${configuration().database.mongo.database}` + 
      `?&authSource=admin`, { serverSelectionTimeoutMS: 5000, useFindAndModify: false }), */
    UsersModule,
    RolesModule,
    // AuthModule,
  ],

  // controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
})
export class AppModule {}
