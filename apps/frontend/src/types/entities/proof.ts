export default interface Proof {
  createdAt: Date;
  deleted: boolean;
  deviceId: string;
  firstName: string;
  id: string;
  lastName: string;
  npi: string;
  phone: string;
  proofDeviceCode: string;
  proofDeviceCreatedDate: Date;
  registrationNumber: number;
  status: ProofStatusEnum;
  updatedAt: Date;
}

export enum ProofStatusEnum {
  VALID = "VALID",
  INVALID = "INVALID",
  PENDING = "PENDING",
}
