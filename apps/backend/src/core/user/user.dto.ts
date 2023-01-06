import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  role: UserRole;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  firstName: string;
}

export class UpdateUserLastNameAndFirstNameDto {
  @ApiProperty()
  lastName: string;

  @ApiProperty()
  firstName: string;
}

export class UpdateUserEmailDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

export class UpdateUserPasswordDto {
  @ApiProperty()
  oldPassword: string;

  @ApiProperty()
  newPassword: string;

  @ApiProperty()
  newPasswordConfirm: string;
}
