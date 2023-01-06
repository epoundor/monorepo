import { Module } from '@nestjs/common';
import { DeviceAssignmentService } from './device-assignment.service';
import { DeviceAssignmentController } from './device-assignment.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [DeviceAssignmentController],
  providers: [DeviceAssignmentService, PrismaService],
})
export class DeviceAssignmentModule {}
