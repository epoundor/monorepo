import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateDeviceDto, UpdateDeviceDto } from './device.dto';
import { DeviceService } from './device.service';
import { Device } from '@prisma/client';

@Controller('devices')
@ApiTags('Device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post()
  async create(@Body() body: CreateDeviceDto): Promise<Device> {
    return await this.deviceService.create(body);
  }

  @Get()
  @ApiQuery({ name: 'skip', type: Number, required: false })
  @ApiQuery({ name: 'take', type: Number, required: false })
  @ApiQuery({ name: 'search', type: String, required: false })
  async findAll(
    @Query('skip') skip = 0,
    @Query('take') take = 100,
    @Query('search') search = '',
  ): Promise<{ items: Device[]; totalItems: number }> {
    return await this.deviceService.findAll(skip, take, search);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Device> {
    return await this.deviceService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateDeviceDto,
  ): Promise<Device> {
    return await this.deviceService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Device> {
    return await this.deviceService.remove(id);
  }

  @Put('enable/:id')
  async enable(@Param('id') id: string): Promise<Device> {
    return await this.deviceService.enable(id);
  }

  @Put('disable/:id')
  async disable(@Param('id') id: string): Promise<Device> {
    return await this.deviceService.disable(id);
  }
}
