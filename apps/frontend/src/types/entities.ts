export interface Device {
  id: number | string;
  name: string;
  agent: User;
  isOnline: boolean;
  lastConnexion: Date;
  compliance: DeviceStatusEnum;
}

export enum DeviceStatusEnum {
  COMPLIANT = "conforme",
  NOT_COMPLIANT = "non_conforme",
}

export interface User {
  id: number | string;
  nom: string;
  surname: string;
  email: string;
  role: "Administrateur";
  isActivated: boolean;
}

export interface State {
  id: number | string;
  label: string;
}
