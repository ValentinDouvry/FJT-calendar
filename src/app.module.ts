import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from './config/configuration';
import { ConfigModule } from '@nestjs/config';
import { EventsModule } from './events/events.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenAuthGuard } from './auth/guards/access-token-auth.guard';
import { RolesGuard } from './auth/guards';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
      load: [configuration],
    }),
    MongooseModule.forRoot(configuration().database.mongo.uri, {
      serverSelectionTimeoutMS: 5000,
    }),
    UsersModule,
    EventsModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
