import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Borough, Common, Department, District } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import * as _ from 'lodash';

@Injectable()
export class LocationService {
  constructor(private prisma: PrismaService) {}

  async getDepartments(
    skip: number,
    take: number,
    search: string,
  ): Promise<Department[]> {
    const departments = await this.prisma.department.findMany({
      where: {
        deleted: false,
        name: { contains: search, mode: 'insensitive' },
      },
      skip: _.toInteger(skip),
      take: _.toInteger(take),
    });

    return departments;
  }

  async getDepartment(departmentId: string): Promise<Department> {
    const department = await this.prisma.department.findUnique({
      where: { id: departmentId },
    });
    if (!department || department.deleted) {
      throw new HttpException('LOCATION_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    return department;
  }

  async getCommons(
    skip: number,
    take: number,
    search: string,
  ): Promise<Common[]> {
    const commons = await this.prisma.common.findMany({
      where: {
        deleted: false,
        name: { contains: search, mode: 'insensitive' },
      },
      skip: _.toInteger(skip),
      take: _.toInteger(take),
    });

    return commons;
  }

  async getCommonsByDepartment(
    departmentId: string,
    skip: number,
    take: number,
    search: string,
  ): Promise<Common[]> {
    const commons = await this.prisma.common.findMany({
      where: {
        deleted: false,
        departmentId,
        name: { contains: search, mode: 'insensitive' },
      },
      skip: _.toInteger(skip),
      take: _.toInteger(take),
    });

    return commons;
  }

  async getCommon(commonId: string): Promise<Common> {
    const common = await this.prisma.common.findUnique({
      where: { id: commonId },
    });
    if (!common || common.deleted) {
      throw new HttpException('LOCATION_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    return common;
  }

  async getBoroughs(
    skip: number,
    take: number,
    search: string,
  ): Promise<Borough[]> {
    const boroughs = await this.prisma.borough.findMany({
      where: {
        deleted: false,
        name: { contains: search, mode: 'insensitive' },
      },
      skip: _.toInteger(skip),
      take: _.toInteger(take),
    });

    return boroughs;
  }

  async getBoroughsByCommon(
    commonId: string,
    skip: number,
    take: number,
    search: string,
  ): Promise<Borough[]> {
    const boroughs = await this.prisma.borough.findMany({
      where: {
        deleted: false,
        commonId,
        name: { contains: search, mode: 'insensitive' },
      },
      skip: _.toInteger(skip),
      take: _.toInteger(take),
    });

    return boroughs;
  }

  async getBorough(boroughId: string): Promise<Borough> {
    const borough = await this.prisma.borough.findUnique({
      where: { id: boroughId },
    });
    if (!borough || borough.deleted) {
      throw new HttpException('LOCATION_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    return borough;
  }

  async getDistricts(
    skip: number,
    take: number,
    search: string,
  ): Promise<District[]> {
    const districts = await this.prisma.district.findMany({
      where: {
        deleted: false,
        name: { contains: search, mode: 'insensitive' },
      },
      skip: _.toInteger(skip),
      take: _.toInteger(take),
    });

    return districts;
  }

  async getDistrictsByBorough(
    boroughId: string,
    skip: number,
    take: number,
    search: string,
  ): Promise<District[]> {
    const districts = await this.prisma.district.findMany({
      where: {
        deleted: false,
        boroughId,
        name: { contains: search, mode: 'insensitive' },
      },
      skip: _.toInteger(skip),
      take: _.toInteger(take),
    });

    return districts;
  }

  async getDistrict(districtId: string): Promise<District> {
    const district = await this.prisma.district.findUnique({
      where: { id: districtId },
    });
    if (!district || district.deleted) {
      throw new HttpException('LOCATION_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    return district;
  }
}
