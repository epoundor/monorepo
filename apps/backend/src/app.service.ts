import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { newTerritory } from './core/territory/transformer';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}
  getHello(): string {
    return 'Hello World!';
  }

  async run() {
    try {
      const data = [];
      const newArrayTerritory = Array.from(newTerritory.entries());

      // for (const departments of newArrayTerritory) {
      //   const dep = {
      //     code: departments[1].code,
      //     name: departments[1].name,
      //     commons: [],
      //   };
      //   data.push(dep);

      //   for (const commons of Array.from(departments[1].commons.entries())) {
      //     const common = {
      //       code: commons[1].code,
      //       name: commons[1].name,
      //       boroughs: [],
      //     };
      //     dep.commons.push(common);

      //     for (const boroughs of Array.from(commons[1].boroughs.entries())) {
      //       const borough = {
      //         code: boroughs[1].code,
      //         name: boroughs[1].name,
      //         districts: [],
      //       };
      //       common.boroughs.push(borough);

      //       for (const districts of Array.from(
      //         boroughs[1].districts.entries(),
      //       )) {
      //         const district = {
      //           code: districts[1].code,
      //           name: districts[1].name,
      //         };
      //         borough.districts.push(district);
      //       }
      //     }
      //   }
      // }
      // console.log(JSON.stringify(data[0]));

      const deps = [];
      for (const departments of newArrayTerritory) {
        const dep = {
          id: departments[1].id,
          code: departments[1].code,
          name: departments[1].name,
        };
        deps.push(dep);
      }

      const commons = [];
      for (const departments of newArrayTerritory) {
        for (const commons2 of Array.from(departments[1].commons.entries())) {
          const common = {
            id: commons2[1].id,
            code: commons2[1].code,
            name: commons2[1].name,
            departmentId: departments[1].id,
          };
          commons.push(common);
        }
      }

      const boroughs = [];
      for (const departments of newArrayTerritory) {
        for (const commons of Array.from(departments[1].commons.entries())) {
          for (const boroughs2 of Array.from(commons[1].boroughs.entries())) {
            const borough = {
              id: boroughs2[1].id,
              code: boroughs2[1].code,
              name: boroughs2[1].name,
              commonId: commons[1].id,
            };
            boroughs.push(borough);
          }
        }
      }

      const districts = [];
      for (const departments of newArrayTerritory) {
        for (const commons of Array.from(departments[1].commons.entries())) {
          for (const boroughs of Array.from(commons[1].boroughs.entries())) {
            for (const districts2 of Array.from(
              boroughs[1].districts.entries(),
            )) {
              const district = {
                id: districts2[1].id,
                code: districts2[1].code,
                name: districts2[1].name,
                boroughId: boroughs[1].id,
              };
              districts.push(district);
            }
          }
        }
      }

      const res1 = await this.prisma.department.createMany({
        data: deps,
      });

      const res2 = await this.prisma.common.createMany({
        data: commons,
      });

      const res3 = await this.prisma.borough.createMany({
        data: boroughs,
      });

      const res4 = await this.prisma.district.createMany({
        data: districts,
      });

      console.log(`${res1}...${res2}...${res3}...${res4}`);
    } catch (error) {
      console.log(error);
    }
  }
}
