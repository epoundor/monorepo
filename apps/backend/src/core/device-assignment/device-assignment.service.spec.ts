import { Test, TestingModule } from '@nestjs/testing';
import { DeviceAssignmentService } from './device-assignment.service';

describe('DeviceAssignmentService', () => {
  let service: DeviceAssignmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeviceAssignmentService],
    }).compile();

    service = module.get<DeviceAssignmentService>(DeviceAssignmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
