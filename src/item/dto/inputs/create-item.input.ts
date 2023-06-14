import { InputType, Field, Float } from '@nestjs/graphql';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsPositive,
  IsOptional,
  IsBoolean,
} from 'class-validator';

@InputType()
export class CreateItemInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;

  /*   @Field(() => Float)
  @IsPositive()
  quantity: number; */

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  quantityUnits?: string; // g,ml, kg, tsp
}
