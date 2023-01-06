import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Device } from '@prisma/client';
import { CreateDeviceDto, UpdateDeviceDto } from './device.dto';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from 'src/prisma.service';
import * as _ from 'lodash';
import { Collection } from '@preuve-de-vie/types';

@Injectable()
export class DeviceService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateDeviceDto): Promise<Device> {
    const foundDeviceReference = await this.prisma.device.findUnique({
      where: {
        referenceAndDeleted: {
          reference: data.reference,
          deleted: false,
        },
      },
    });
    if (foundDeviceReference) {
      throw new HttpException('DEVICE_EXIST', HttpStatus.BAD_REQUEST);
    }

    const createdDevice = await this.prisma.device.create({
      data: {
        id: uuidv4(),
        reference: data.reference,
        enable: data.enable,
      },
    });

    return createdDevice;
  }
  //TODO Improves types
  async findAll(
    skip: number,
    take: number,
    search: string,
  ): Promise<Collection<Device>> {
    const devices: Device[] = await this.prisma.device.findMany({
      where: {
        deleted: false,
        reference: { contains: search, mode: 'insensitive' },
      },
      skip: _.toInteger(skip),
      take: _.toInteger(take),
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalItems = await this.prisma.device.count({
      where: {
        deleted: false,
        OR: [
          {
            reference: { contains: search, mode: 'insensitive' },
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { items: devices, totalItems };
  }

  async findOne(id: string): Promise<Device> {
    const foundDevice = await this.prisma.device.findUnique({
      where: { id },
    });
    if (!foundDevice || foundDevice.deleted) {
      throw new HttpException('DEVICE_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    return foundDevice;
  }

  async update(id: string, data: UpdateDeviceDto): Promise<Device> {
    const foundDevice = await this.prisma.device.findUnique({
      where: { id },
    });
    if (!foundDevice || foundDevice.deleted) {
      throw new HttpException('DEVICE_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const foundDeviceReference = await this.prisma.device.findUnique({
      where: {
        referenceAndDeleted: {
          reference: data.reference,
          deleted: false,
        },
      },
    });
    if (foundDeviceReference && foundDeviceReference.id !== id) {
      throw new HttpException('DEVICE_EXIST', HttpStatus.BAD_REQUEST);
    }

    const updatedDevice = await this.prisma.device.update({
      where: { id },
      data: {
        reference: data.reference,
        enable: data.enable,
        updatedAt: new Date(),
      },
    });

    return updatedDevice;
  }

  async remove(id: string): Promise<Device> {
    const foundDevice = await this.prisma.device.findUnique({
      where: { id },
    });
    if (!foundDevice || foundDevice.deleted) {
      throw new HttpException('DEVICE_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const removedUser = await this.prisma.device.update({
      where: { id },
      data: {
        deleted: true,
      },
    });

    return removedUser;
  }

  async enable(id: string): Promise<Device> {
    const foundDevice = await this.prisma.device.findUnique({
      where: { id },
    });
    if (!foundDevice || foundDevice.deleted) {
      throw new HttpException('DEVICE_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const updatedDevice = await this.prisma.device.update({
      where: { id },
      data: { enable: true },
    });

    return updatedDevice;
  }

  async disable(id: string): Promise<Device> {
    const foundDevice = await this.prisma.device.findUnique({
      where: { id },
    });
    if (!foundDevice || foundDevice.deleted) {
      throw new HttpException('DEVICE_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const updatedDevice = await this.prisma.device.update({
      where: { id },
      data: { enable: false },
    });

    return updatedDevice;
  }
}
