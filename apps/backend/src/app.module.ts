import { Module } from '@nestjs/common';
import { DeviceAssignmentModule } from './core/device-assignment/device-assignment.module';
import { DeviceModule } from './core/device/device.module';
import { ProofOfLifeModule } from './core/proof-of-life/proof-of-life.module';
import { UserModule } from './core/user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { LocationModule } from './core/location/location.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    HttpModule,
    DeviceModule,
    DeviceAssignmentModule,
    ProofOfLifeModule,
    UserModule,
    LocationModule,
    ScheduleModule.forRoot(),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
