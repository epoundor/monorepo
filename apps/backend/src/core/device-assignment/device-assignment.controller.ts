import { Controller, Post, Body, Param, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateDeviceAssignmentDto } from './device-assignment.dto';
import { DeviceAssignmentService } from './device-assignment.service';
import { DeviceAssignment } from '@prisma/client';

@Controller('devices-assignment')
@ApiTags('DeviceAssignment')
export class DeviceAssignmentController {
  constructor(
    private readonly deviceAssignmentService: DeviceAssignmentService,
  ) {}

  @Post()
  async create(
    @Body() body: CreateDeviceAssignmentDto,
  ): Promise<DeviceAssignment> {
    return await this.deviceAssignmentService.create(body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<DeviceAssignment> {
    return await this.deviceAssignmentService.remove(id);
  }
}
