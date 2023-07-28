import {
  IsNotEmpty,
  IsArray,
  IsString,
  ArrayNotEmpty,
  ArrayMinSize,
} from 'class-validator';

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
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  listing: string[];
}
