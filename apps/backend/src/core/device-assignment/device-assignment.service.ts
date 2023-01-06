import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DeviceAssignment } from '@prisma/client';
import { CreateDeviceAssignmentDto } from './device-assignment.dto';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class DeviceAssignmentService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateDeviceAssignmentDto): Promise<DeviceAssignment> {
    // const foundDevice = await this.prisma.device.findUnique({
    //   where: { id: data.deviceId },
    // });
    // if (!foundDevice || foundDevice.deleted) {
    //   throw new HttpException('DEVICE_NOT_FOUND', HttpStatus.NOT_FOUND);
    // }

    // const foundDepartment = await this.prisma.department.findUnique({
    //   where: { id: data.departmentId },
    // });
    // if (!foundDepartment || foundDepartment.deleted) {
    //   throw new HttpException('DEPARTMENT_NOT_FOUND', HttpStatus.NOT_FOUND);
    // }

    // const foundCommon = await this.prisma.common.findUnique({
    //   where: { id: data.commonId },
    // });
    // if (!foundCommon || foundCommon.deleted) {
    //   throw new HttpException('DEPARTMENT_NOT_FOUND', HttpStatus.NOT_FOUND);
    // }

    // const foundBorough = await this.prisma.borough.findUnique({
    //   where: { id: data.boroughId },
    // });
    // if (!foundBorough || foundBorough.deleted) {
    //   throw new HttpException('DEPARTMENT_NOT_FOUND', HttpStatus.NOT_FOUND);
    // }

    // const foundDistrict = await this.prisma.district.findUnique({
    //   where: { id: data.districtId },
    // });
    // if (!foundDistrict || foundDistrict.deleted) {
    //   throw new HttpException('DEPARTMENT_NOT_FOUND', HttpStatus.NOT_FOUND);
    // }

    const createdAssignement = await this.prisma.deviceAssignment.create({
      data: {
        id: uuidv4(),
        deviceId: data.deviceId,
        departmentId: data.departmentId,
        commonId: data.commonId,
        boroughId: data.boroughId,
        districtId: data.districtId,
      },
    });

    return createdAssignement;
  }

  async remove(id: string): Promise<DeviceAssignment> {
    const foundAssignment = await this.prisma.deviceAssignment.findUnique({
      where: { id },
    });
    if (!foundAssignment || foundAssignment.deleted) {
      throw new HttpException('ASSIGNMENT_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const removedAssignment = await this.prisma.deviceAssignment.update({
      where: { id },
      data: { deleted: true },
    });

    return removedAssignment;
  }
}
