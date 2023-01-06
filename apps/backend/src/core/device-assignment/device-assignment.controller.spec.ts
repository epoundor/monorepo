import { Test, TestingModule } from '@nestjs/testing';
import { DeviceAssignmentController } from './device-assignment.controller';
import { DeviceAssignmentService } from './device-assignment.service';

describe('DeviceAssignmentController', () => {
  let controller: DeviceAssignmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeviceAssignmentController],
      providers: [DeviceAssignmentService],
    }).compile();

    controller = module.get<DeviceAssignmentController>(DeviceAssignmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
