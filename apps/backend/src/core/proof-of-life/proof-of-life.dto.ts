import { ApiProperty } from '@nestjs/swagger';
import { ProofOfLifeStatus } from '@prisma/client';

export class CreateProofOfLifeDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  proofDeviceCreatedDate: Date;

  @ApiProperty()
  registrationNumber: string;

  @ApiProperty()
  npi: string;

  @ApiProperty()
  dateOfBirth: string;

  @ApiProperty()
  placeOfBirth: string;

  @ApiProperty()
  cardNumber: string;

  @ApiProperty()
  deviceProofId: string;

  @ApiProperty()
  deviceId: string;

  @ApiProperty()
  profession: string;
}

export class ProofFilterDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  deviceIds: string[];

  @ApiProperty()
  proofDeviceCreatedDate: Date[];

  @ApiProperty()
  proofReceiveDate: Date[];

  @ApiProperty()
  proofStatus: ProofOfLifeStatus[];
}
