import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Response<T> {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  data?: T | T[];

  @ApiPropertyOptional()
  errorMessage?: string;
}
