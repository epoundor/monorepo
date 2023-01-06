import { Test, TestingModule } from '@nestjs/testing';
import { ProofOfLifeService } from './proof-of-life.service';

describe('ProofOfLifeService', () => {
  let service: ProofOfLifeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProofOfLifeService],
    }).compile();

    service = module.get<ProofOfLifeService>(ProofOfLifeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
