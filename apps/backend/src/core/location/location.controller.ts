import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Borough, Common, Department, District } from '@prisma/client';
import { LocationService } from './location.service';

@Controller('locations')
@ApiTags('Location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('departments')
  @ApiQuery({ name: 'skip', type: Number, required: false })
  @ApiQuery({ name: 'take', type: Number, required: false })
  @ApiQuery({ name: 'search', type: String, required: false })
  async getDepartments(
    @Query('skip') skip = 0,
    @Query('take') take = 100,
    @Query('search') search = '',
  ): Promise<Department[]> {
    return await this.locationService.getDepartments(skip, take, search);
  }

  @Get('department/:departmentId')
  async getDepartment(
    @Param('departmentId') departmentId: string,
  ): Promise<Department> {
    return await this.locationService.getDepartment(departmentId);
  }

  @Get('commons')
  @ApiQuery({ name: 'skip', type: Number, required: false })
  @ApiQuery({ name: 'take', type: Number, required: false })
  @ApiQuery({ name: 'search', type: String, required: false })
  async getCommons(
    @Query('skip') skip = 0,
    @Query('take') take = 100,
    @Query('search') search = '',
  ): Promise<Common[]> {
    return await this.locationService.getCommons(skip, take, search);
  }

  @Get('commons-by-department/:departmentId')
  @ApiQuery({ name: 'skip', type: Number, required: false })
  @ApiQuery({ name: 'take', type: Number, required: false })
  @ApiQuery({ name: 'search', type: String, required: false })
  async getCommonsByDepartment(
    @Param('departmentId') departmentId: string,
    @Query('skip') skip = 0,
    @Query('take') take = 100,
    @Query('search') search = '',
  ): Promise<Common[]> {
    return await this.locationService.getCommonsByDepartment(
      departmentId,
      skip,
      take,
      search,
    );
  }

  @Get('common/:commonId')
  async getCommon(@Param('commonId') commonId: string): Promise<Common> {
    return await this.locationService.getCommon(commonId);
  }

  @Get('boroughs')
  @ApiQuery({ name: 'skip', type: Number, required: false })
  @ApiQuery({ name: 'take', type: Number, required: false })
  @ApiQuery({ name: 'search', type: String, required: false })
  async getBoroughs(
    @Query('skip') skip = 0,
    @Query('take') take = 100,
    @Query('search') search = '',
  ): Promise<Borough[]> {
    return await this.locationService.getBoroughs(skip, take, search);
  }

  @Get('boroughs-by-common/:commonId')
  @ApiQuery({ name: 'skip', type: Number, required: false })
  @ApiQuery({ name: 'take', type: Number, required: false })
  @ApiQuery({ name: 'search', type: String, required: false })
  async getBoroughsByCommon(
    @Param('commonId') commonId: string,
    @Query('skip') skip = 0,
    @Query('take') take = 100,
    @Query('search') search = '',
  ): Promise<Borough[]> {
    return await this.locationService.getBoroughsByCommon(
      commonId,
      skip,
      take,
      search,
    );
  }

  @Get('borough/:boroughId')
  async getBorough(@Param('boroughId') boroughId: string): Promise<Borough> {
    return await this.locationService.getBorough(boroughId);
  }

  @Get('districts')
  @ApiQuery({ name: 'skip', type: Number, required: false })
  @ApiQuery({ name: 'take', type: Number, required: false })
  @ApiQuery({ name: 'search', type: String, required: false })
  async getDistricts(
    @Query('skip') skip = 0,
    @Query('take') take = 100,
    @Query('search') search = '',
  ): Promise<District[]> {
    return await this.locationService.getDistricts(skip, take, search);
  }

  @Get('districts-by-borough/:boroughId')
  @ApiQuery({ name: 'skip', type: Number, required: false })
  @ApiQuery({ name: 'take', type: Number, required: false })
  @ApiQuery({ name: 'search', type: String, required: false })
  async getDistrictsByBorough(
    @Param('boroughId') boroughId: string,
    @Query('skip') skip = 0,
    @Query('take') take = 100,
    @Query('search') search = '',
  ): Promise<District[]> {
    return await this.locationService.getDistrictsByBorough(
      boroughId,
      skip,
      take,
      search,
    );
  }

  @Get('district/:districtId')
  async getDistrict(
    @Param('dictrictId') districtId: string,
  ): Promise<District> {
    return await this.locationService.getDistrict(districtId);
  }
}
