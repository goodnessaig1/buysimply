import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LoansModule } from './loans/loans.module';
import { SeedService } from './db/seed.service';
import { KeepAliveService } from './common/keep-alive.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    DbModule,
    AuthModule,
    UsersModule,
    LoansModule,
  ],
  controllers: [AppController],
  providers: [AppService, SeedService, KeepAliveService],
})
export class AppModule {}
