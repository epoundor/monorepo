import { ApiProperty } from '@nestjs/swagger';

export class CreateDeviceAssignmentDto {
  @ApiProperty()
  deviceId: string;

  @ApiProperty()
  departmentId: string;

  @ApiProperty()
  commonId: string;

  @ApiProperty()
  boroughId: string;

  @ApiProperty()
  districtId: string;
}
