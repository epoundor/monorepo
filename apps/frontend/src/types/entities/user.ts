export default interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  enable: boolean;
  createdAt: Date;
  updatedAt: Date;
  placeAssignments: string[];
  deviceAssignments: string[];
  isActivated: boolean;
}

export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  AGENT = "AGENT",
}
