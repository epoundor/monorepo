import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProofOfLife, ProofOfLifeStatus } from '@prisma/client';
import { CreateProofOfLifeDto, ProofFilterDto } from './proof-of-life.dto';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from 'src/prisma.service';
import { Axios } from 'axios';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as _ from 'lodash';
import { HttpService } from '@nestjs/axios';
import sleep from 'src/utils/sleep';
import { Random } from 'random-js';
import { Collection } from '@preuve-de-vie/types';

@Injectable()
export class ProofOfLifeService {
  axios: Axios;

  constructor(
    private prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {
    this.axios = new Axios();
  }

  async create(data: CreateProofOfLifeDto[]): Promise<boolean> {
    const foundDevice = await this.prisma.device.findUnique({
      where: {
        id: data.length ? data[0].deviceId : '',
      },
    });
    if (!foundDevice || foundDevice.deleted) {
      throw new HttpException('DEVICE_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const proofs = [];
    for (let i = 0; i < data.length; i++) {
      const proof = {
        id: uuidv4(),
        firstName: data[i].firstName,
        lastName: data[i].lastName,
        deviceId: foundDevice,
        proofDeviceCreatedDate: data[i].proofDeviceCreatedDate,
        npi: data[i].npi,
        dateOfBirth: data[i].dateOfBirth,
        placeOfBirth: data[i].placeOfBirth,
        cardNumber: data[i].cardNumber,
        deviceProofId: data[i].deviceProofId,
        profession: data[i].profession,
        registrationNumber: data[i].registrationNumber,
      };

      proofs.push(proof);
    }

    await this.prisma.proofOfLife.createMany({
      data: proofs,
      skipDuplicates: true,
    });

    return true;
  }

  async findAll(
    skip: number,
    take: number,
    search: string,
    filter: ProofFilterDto,
  ): Promise<{ items: ProofOfLife[]; totalItems: number }> {
    let proofs: ProofOfLife[];

    if (!filter) {
      proofs = await this.prisma.proofOfLife.findMany({
        where: {
          deleted: false,
          OR: [
            {
              firstName: { contains: search, mode: 'insensitive' },
            },
            {
              lastName: { contains: search, mode: 'insensitive' },
            },
          ],
        },
        skip: _.toInteger(skip),
        take: _.toInteger(take),
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else {
      proofs = await this.prisma.proofOfLife.findMany({
        where: {
          OR: [
            {
              firstName: { contains: search, mode: 'insensitive' },
            },
            {
              lastName: { contains: search, mode: 'insensitive' },
            },
          ],
          AND: {
            deleted: false,
            deviceId: { in: filter.deviceIds },
            status: { in: filter.proofStatus },
            proofDeviceCreatedDate: {
              gte: filter.proofDeviceCreatedDate[0],
              lte: filter.proofDeviceCreatedDate[1],
            },
            createdAt: {
              gte: filter.proofReceiveDate[0],
              lte: filter.proofReceiveDate[1],
            },
          },
        },
        skip,
        take,
        orderBy: {
          createdAt: 'desc',
        },
      });
    }
    const totalItems = await this.prisma.proofOfLife.count({
      where: {
        deleted: false,
        OR: [
          {
            firstName: { contains: search, mode: 'insensitive' },
          },
          {
            lastName: { contains: search, mode: 'insensitive' },
          },
        ],
      },
    });
    return { items: proofs, totalItems };
  }

  async findOne(id: string): Promise<ProofOfLife> {
    const proofOfLife = await this.prisma.proofOfLife.findUnique({
      where: { id },
    });
    if (!proofOfLife || proofOfLife.deleted) {
      throw new HttpException('PROOF_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    return proofOfLife;
  }

  async verify(proofId: string): Promise<ProofOfLife> {
    const foundProof = await this.prisma.proofOfLife.findUnique({
      where: {
        id: proofId,
      },
    });

    if (!foundProof) {
      throw new HttpException('PROOF_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    if (foundProof.status !== ProofOfLifeStatus.PENDING) {
      throw new HttpException('PROOF_IS_VERIFIED', HttpStatus.BAD_REQUEST);
    }

    await sleep(3000);
    const updatedProof: ProofOfLife = await this.prisma.proofOfLife.update({
      where: { id: foundProof.id },
      data: {
        status:
          Math.random() > 0.5
            ? ProofOfLifeStatus.VALID
            : ProofOfLifeStatus.INVALID,
      },
    });

    return updatedProof;
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async verifies() {
    const foundProofs = await this.prisma.proofOfLife.findMany({
      where: {
        status: ProofOfLifeStatus.PENDING,
        deleted: false,
      },
    });

    for (const foundProof of foundProofs) {
      await this.prisma.proofOfLife.updateMany({
        where: { id: foundProof.id },
        data: {
          status:
            Math.random() > 0.5
              ? ProofOfLifeStatus.VALID
              : ProofOfLifeStatus.INVALID,
        },
      });
    }

    return true;
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async updateRegistrationNumbers() {
    // const numbersCountRequest = await this.httpService.axiosRef.get('');
    // const numbersCount = numbersCountRequest.data;

    // const totalPagesCount = _.ceil(numbersCount / 100);
    // let currentPagesCount = 1;
    // let lastRequestSuccess = true;

    // while (lastRequestSuccess && currentPagesCount <= totalPagesCount) {
    //   let requestAttemptFailed = 0;

    //   do {
    //     let data: RegistrationNumber[];

    //     try {
    //       const registrationNumberRequest = await this.httpService.axiosRef.get(
    //         '',
    //       );
    //       lastRequestSuccess = true;
    //       data = registrationNumberRequest.data;
    //     } catch (error) {
    //       lastRequestSuccess = false;
    //       requestAttemptFailed++;
    //       throw new Error(error);
    //     }

    //     await this.prisma.registrationNumber.createMany({
    //       data,
    //       skipDuplicates: true,
    //     });
    //   } while (!lastRequestSuccess && requestAttemptFailed <= 2);

    //   currentPagesCount++;
    // }

    await this.prisma.registrationNumber.create({
      data: {
        registrationNumber: _.toString(
          new Random().integer(1000000000, 9999999999),
        ),
      },
    });

    return true;
  }

  async getRegistrationNumbers() {
    return await this.prisma.registrationNumber.findMany();
  }

  async countProof(): Promise<Record<string, number>> {
    const total = await this.prisma.proofOfLife.count({
      where: {
        deleted: false,
      },
    });

    const invalid = await this.prisma.proofOfLife.count({
      where: {
        status: ProofOfLifeStatus.INVALID,
      },
    });

    const valid = await this.prisma.proofOfLife.count({
      where: {
        status: ProofOfLifeStatus.VALID,
      },
    });

    const pending = await this.prisma.proofOfLife.count({
      where: {
        status: ProofOfLifeStatus.PENDING,
      },
    });

    return { total, invalid, valid, pending };
  }

  async last(take: number): Promise<Collection<ProofOfLife>> {
    take = _.toInteger(take);
    const proofs = await this.prisma.proofOfLife.findMany({
      take,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { items: proofs, totalItems: take };
  }

  async proofsByDevice(skip: number, take: number, deviceId: string) {
    const foundDevice = await this.prisma.device.findUnique({
      where: {
        id: deviceId,
      },
    });
    if (!foundDevice || foundDevice.deleted) {
      throw new HttpException('DEVICE_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const proofs = await this.prisma.proofOfLife.findMany({
      where: {
        deleted: false,
        device: foundDevice,
      },
      skip: _.toInteger(skip),
      take: _.toInteger(take),
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalItems = await this.prisma.proofOfLife.count({
      where: {
        deleted: false,
        device: foundDevice,
      },
    });
    return { items: proofs, totalItems };
  }

  async proofsByRegistrationNumber(
    skip: number,
    take: number,
    registrationNumber: string,
  ) {
    const proofs = await this.prisma.proofOfLife.findMany({
      where: {
        deleted: false,
        registrationNumber,
      },
      skip: _.toInteger(skip),
      take: _.toInteger(take),
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalItems = await this.prisma.proofOfLife.count({
      where: {
        deleted: false,
        registrationNumber,
      },
    });
    return { items: proofs, totalItems };
  }
}
