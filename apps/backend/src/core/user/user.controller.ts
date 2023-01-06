import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  CreateUserDto,
  UpdateUserEmailDto,
  UpdateUserLastNameAndFirstNameDto,
  UpdateUserPasswordDto,
} from './user.dto';
import { UserService } from './user.service';
import { User } from '@prisma/client';

@Controller('users')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.create(createUserDto);
  }

  @Get()
  @ApiQuery({ name: 'skip', type: Number, required: false })
  @ApiQuery({ name: 'take', type: Number, required: false })
  @ApiQuery({ name: 'search', type: String, required: false })
  async findAll(
    @Query('skip') skip = 0,
    @Query('take') take = 100,
    @Query('search') search = '',
  ): Promise<{ items: User[]; totalItems: number }> {
    return await this.userService.findAll(skip, take, search);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.userService.findOne(id);
  }

  @Put(':id/name')
  async updateLastsNameAndFirstName(
    @Param('id') id: string,
    @Body() body: UpdateUserLastNameAndFirstNameDto,
  ): Promise<User> {
    return await this.userService.updateLatsNameAndFirstName(id, body);
  }

  @Put(':id/login')
  async updateEmailAndPhone(
    @Param('id') id: string,
    @Body() body: UpdateUserEmailDto,
  ): Promise<User> {
    return await this.userService.updateEmail(id, body);
  }

  @Put(':id/password')
  async updatePassword(
    @Param('id') id: string,
    @Body() body: UpdateUserPasswordDto,
  ): Promise<User> {
    return await this.userService.updatePassword(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<User> {
    return await this.userService.remove(id);
  }

  @Put('enable/:id')
  async enable(@Param('id') id: string): Promise<User> {
    return await this.userService.enable(id);
  }

  @Put('disable/:id')
  async disable(@Param('id') id: string): Promise<User> {
    return await this.userService.disable(id);
  }
}
