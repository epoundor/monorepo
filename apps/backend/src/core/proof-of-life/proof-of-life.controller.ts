import { Controller, Get, Post, Body, Param, Query, Put } from '@nestjs/common';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateProofOfLifeDto, ProofFilterDto } from './proof-of-life.dto';
import { ProofOfLifeService } from './proof-of-life.service';
import { ProofOfLife, RegistrationNumber } from '@prisma/client';

@Controller('proofs-of-life')
@ApiTags('ProofOfLife')
export class ProofOfLifeController {
  constructor(private readonly proofOfLifeService: ProofOfLifeService) {}

  @Post()
  @ApiBody({ isArray: true, type: CreateProofOfLifeDto })
  async create(@Body() body: CreateProofOfLifeDto[]): Promise<boolean> {
    return await this.proofOfLifeService.create(body);
  }

  @Get()
  @ApiQuery({ name: 'skip', type: Number, required: false })
  @ApiQuery({ name: 'take', type: Number, required: false })
  @ApiQuery({ name: 'search', type: String, required: false })
  async findAll(
    @Query('skip') skip = 0,
    @Query('take') take = 100,
    @Query('search') search = '',
    @Query('filter') filter: ProofFilterDto,
  ): Promise<{ items: ProofOfLife[]; totalItems: number }> {
    return await this.proofOfLifeService.findAll(skip, take, search, filter);
  }

  @Get('last')
  @ApiQuery({ name: 'take', type: Number, required: false })
  async last(
    @Query('take') take = 10,
  ): Promise<{ items: ProofOfLife[]; totalItems: number }> {
    return await this.proofOfLifeService.last(take);
  }

  @Get('stats')
  async stats(): Promise<Record<string, number>> {
    return await this.proofOfLifeService.countProof();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProofOfLife> {
    return await this.proofOfLifeService.findOne(id);
  }

  @Put('verify/:proofId')
  async verify(@Param('proofId') proofId: string): Promise<ProofOfLife> {
    return await this.proofOfLifeService.verify(proofId);
  }

  @Get('registration-numbers/all')
  async getRegistrationNumbers(): Promise<RegistrationNumber[]> {
    return await this.proofOfLifeService.getRegistrationNumbers();
  }

  @Get('proofs-by-device/:deviceId')
  @ApiQuery({ name: 'skip', type: Number, required: false })
  @ApiQuery({ name: 'take', type: Number, required: false })
  async getProofsByDevice(
    @Query('skip') skip = 0,
    @Query('take') take = 100,
    @Param('deviceId') deviceId: string,
  ) {
    return await this.proofOfLifeService.proofsByDevice(skip, take, deviceId);
  }

  @Get('proofs-by-registration-number/:registrationNumberId')
  @ApiQuery({ name: 'skip', type: Number, required: false })
  @ApiQuery({ name: 'take', type: Number, required: false })
  async getProofsByRegistrationNumber(
    @Query('skip') skip = 0,
    @Query('take') take = 100,
    @Param('registrationNumberId') registrationNumberId: string,
  ) {
    return await this.proofOfLifeService.proofsByRegistrationNumber(
      skip,
      take,
      registrationNumberId,
    );
  }
}
