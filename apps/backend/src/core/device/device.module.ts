import { Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [DeviceController],
  providers: [DeviceService, PrismaService],
})
export class DeviceModule {}
