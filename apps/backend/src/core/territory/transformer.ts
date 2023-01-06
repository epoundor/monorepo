// import myTerritory from './territoire.json';
// import { newTerritory } from '../transformer';

import { readFileSync } from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

let myTerritory;

export function ReadTerritory() {
  myTerritory = readFileSync(path.resolve('./territoire.json'));
  myTerritory = JSON.parse(myTerritory);
}

interface IOldTerritory {
  CDP: string;
  DP: string;
  CCM: string;
  CM: string;
  CAR: string;
  AR: string;
  VQ: string;
  CVQ: string;
}

interface IDistrict {
  id: string;
  code: string;
  name: string;
}

interface IBorough {
  id: string;
  code: string;
  name: string;
  districts: Map<string, IDistrict>;
}

interface ICommon {
  id: string;
  code: string;
  name: string;
  boroughs: Map<string, IBorough>;
}

interface IDepartment {
  id: string;
  code: string;
  name: string;
  commons: Map<string, ICommon>;
}

export const newTerritory: Map<string, IDepartment> = new Map<
  string,
  IDepartment
>();

export async function transformer() {
  const oldTerritory: IOldTerritory[] = myTerritory;
  for (let i = 0; i < oldTerritory.length; i++) {
    if (!newTerritory.has(String(oldTerritory[i].CDP))) {
      const newDepartement: IDepartment = {} as IDepartment;
      newDepartement.id = uuidv4();
      newDepartement.code = String(oldTerritory[i].CDP);
      newDepartement.name = oldTerritory[i].DP;
      newDepartement.commons = new Map<string, ICommon>();

      newTerritory.set(String(oldTerritory[i].CDP), newDepartement);
    }
  }

  for (let i = 0; i < oldTerritory.length; i++) {
    if (
      !newTerritory
        .get(String(oldTerritory[i].CDP))
        .commons.has(String(oldTerritory[i].CCM))
    ) {
      const newCommon: ICommon = {} as ICommon;
      newCommon.id = uuidv4();
      newCommon.code = String(oldTerritory[i].CCM);
      newCommon.name = oldTerritory[i].CM;
      newCommon.boroughs = new Map<string, IBorough>();

      newTerritory
        .get(String(oldTerritory[i].CDP))
        .commons.set(String(oldTerritory[i].CCM), newCommon);
    }
  }

  for (let i = 0; i < oldTerritory.length; i++) {
    if (
      !newTerritory
        .get(String(oldTerritory[i].CDP))
        .commons.get(String(oldTerritory[i].CCM))
        .boroughs.has(String(oldTerritory[i].CAR))
    ) {
      const newBorough: IBorough = {} as IBorough;
      newBorough.id = uuidv4();
      newBorough.code = String(oldTerritory[i].CAR);
      newBorough.name = oldTerritory[i].AR;
      newBorough.districts = new Map<string, IDistrict>();

      newTerritory
        .get(String(oldTerritory[i].CDP))
        .commons.get(String(oldTerritory[i].CCM))
        .boroughs.set(String(oldTerritory[i].CAR), newBorough);
    }
  }

  for (let i = 0; i < oldTerritory.length; i++) {
    if (
      !newTerritory
        .get(String(oldTerritory[i].CDP))
        .commons.get(String(oldTerritory[i].CCM))
        .boroughs.get(String(oldTerritory[i].CAR))
        .districts.has(String(oldTerritory[i].CVQ))
    ) {
      const newDistrict: IDistrict = {} as IDistrict;
      newDistrict.id = uuidv4();
      newDistrict.code = String(oldTerritory[i].CVQ);
      newDistrict.name = oldTerritory[i].VQ;

      newTerritory
        .get(String(oldTerritory[i].CDP))
        .commons.get(String(oldTerritory[i].CCM))
        .boroughs.get(String(oldTerritory[i].CAR))
        .districts.set(String(oldTerritory[i].CVQ), newDistrict);
    }
  }

  // console.log(newTerritory.get('09').commons.get('0902').boroughs.get('090205').districts.get('09.2.05.06'));
}
