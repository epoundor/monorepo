import { ApiProperty } from '@nestjs/swagger';

export class CreateDeviceDto {
  @ApiProperty()
  reference: string;

  @ApiProperty()
  enable: boolean;
}

export class UpdateDeviceDto {
  @ApiProperty()
  reference: string;

  @ApiProperty()
  enable: boolean;
}
