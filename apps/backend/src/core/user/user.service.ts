import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateUserDto,
  UpdateUserEmailDto,
  UpdateUserLastNameAndFirstNameDto,
  UpdateUserPasswordDto,
} from './user.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from 'src/prisma.service';
import { User } from '@prisma/client';
import * as _ from 'lodash';
import { Collection } from '@monorepo/types';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<User> {
    const foundUserEmail = await this.prisma.user.findUnique({
      where: {
        emailAndDeleted: {
          email: data.email,
          deleted: false,
        },
      },
    });
    if (foundUserEmail) {
      throw new HttpException('EMAIL_EXIST', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(_.trim(_.toString('')), 10);

    const createdUser = await this.prisma.user.create({
      data: {
        id: uuidv4(),
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: hashedPassword,
        role: data.role,
      },
    });

    return createdUser;
  }
  //TODO Improves types
  async findAll(
    skip: number,
    take: number,
    search: string,
  ): Promise<Collection<User>> {
    const foundUsers: User[] = await this.prisma.user.findMany({
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

    const totalItems = await this.prisma.user.count({
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

    return { items: foundUsers, totalItems };
  }

  async findOne(id: string): Promise<User> {
    const foundUser = await this.prisma.user.findUnique({
      where: { id: id },
    });
    if (!foundUser || foundUser.deleted) {
      throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    return foundUser;
  }

  async findOneByEmail(email: string): Promise<User> {
    const foundUser = await this.prisma.user.findUnique({
      where: { emailAndDeleted: { email, deleted: false } },
    });
    return foundUser;
  }

  async updateLatsNameAndFirstName(
    id: string,
    data: UpdateUserLastNameAndFirstNameDto,
  ): Promise<User> {
    const foundUser = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!foundUser || foundUser.deleted) {
      throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
      },
    });

    return updatedUser;
  }

  async updateEmail(id: string, data: UpdateUserEmailDto): Promise<User> {
    const foundUser = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!foundUser || foundUser.deleted) {
      throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const foundUserEmail = await this.prisma.user.findUnique({
      where: {
        emailAndDeleted: {
          email: data.email,
          deleted: false,
        },
      },
    });
    if (foundUserEmail && foundUserEmail.id !== id) {
      throw new HttpException('EMAIL_EXIST', HttpStatus.BAD_REQUEST);
    }

    const passwordsIsEqual = await bcrypt.compare(
      _.trim(_.toString(data.password)),
      foundUser.password,
    );
    if (!passwordsIsEqual) {
      throw new HttpException('PASSWORD_INCORRECT', HttpStatus.BAD_REQUEST);
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        id,
      },
      data: { email: data.email },
    });

    return updatedUser;
  }

  async updatePassword(id: string, data: UpdateUserPasswordDto): Promise<User> {
    const foundUser = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!foundUser || foundUser.deleted) {
      throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const passwordsIsEqual = await bcrypt.compare(
      _.trim(_.toString(data.oldPassword)),
      foundUser.password,
    );
    if (!passwordsIsEqual) {
      throw new HttpException('PASSWORD_INCORRECT', HttpStatus.BAD_REQUEST);
    }

    if (data.newPassword !== data.newPasswordConfirm) {
      throw new HttpException('PASSWORD_INCORRECT', HttpStatus.BAD_REQUEST);
    }

    const newHashedPassword = await bcrypt.hash(
      _.trim(_.toString(data.newPassword)),
      10,
    );

    const updatedUser = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        password: newHashedPassword,
      },
    });

    return updatedUser;
  }

  async remove(id: string): Promise<User> {
    const foundUser = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!foundUser || foundUser.deleted) {
      throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const removedUser = await this.prisma.user.update({
      where: { id },
      data: { deleted: true },
    });

    return removedUser;
  }

  async enable(id: string): Promise<User> {
    const foundUser = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!foundUser || foundUser.deleted) {
      throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { enable: true },
    });

    return updatedUser;
  }

  async disable(id: string): Promise<User> {
    const foundUser = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!foundUser || foundUser.deleted) {
      throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { enable: false },
    });

    return updatedUser;
  }

  async login(email: string, password: string) {
    const foundUser = await this.prisma.user.findUnique({
      where: {
        emailAndDeleted: {
          email,
          deleted: false,
        },
      },
    });
    if (!foundUser) {
      throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const passwordMatch = await bcrypt.compare(password, foundUser.password);
    if (!passwordMatch) {
      throw new HttpException('PASSWORD_INCORRECT', HttpStatus.BAD_REQUEST);
    }

    return true;
  }

  async logout(email: string) {
    return;
  }
}
