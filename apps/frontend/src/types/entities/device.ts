export default interface Device {
  id: string;
  reference: string;
  enable: boolean;
  agent: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  compliance: boolean;
}
