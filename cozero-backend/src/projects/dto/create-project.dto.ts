import { IsNotEmpty, IsArray, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsArray()
  co2EstimateReduction: number[];

  @IsNotEmpty()
  @IsString()
  owner: string;

  @IsNotEmpty()
  @IsArray()
  listing: string[];
}
