import { Test, TestingModule } from '@nestjs/testing';
import { ProofOfLifeController } from './proof-of-life.controller';
import { ProofOfLifeService } from './proof-of-life.service';

describe('ProofOfLifeController', () => {
  let controller: ProofOfLifeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProofOfLifeController],
      providers: [ProofOfLifeService],
    }).compile();

    controller = module.get<ProofOfLifeController>(ProofOfLifeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
