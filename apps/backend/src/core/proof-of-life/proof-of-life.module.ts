import { Module } from '@nestjs/common';
import { ProofOfLifeService } from './proof-of-life.service';
import { ProofOfLifeController } from './proof-of-life.controller';
import { PrismaService } from 'src/prisma.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [ProofOfLifeController],
  providers: [ProofOfLifeService, PrismaService],
})
export class ProofOfLifeModule {}
