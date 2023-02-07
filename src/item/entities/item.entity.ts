import { ObjectType, Field, Int, ID, Float } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


@Entity({name:'items'})
@ObjectType()
export class Item {
  
  
  @PrimaryGeneratedColumn('uuid')
  @Field(()=>ID)
  id:string

  @Column()
  @Field(()=>String)
  name:string;


  @Column('bool', {default:true})
  @Field(()=>Boolean, {nullable:true})
  isActive:boolean

  @Column('float')
  @Field(()=>Float)
  quantity:number;

  @Column({nullable:true})
  @Field(()=>String,{nullable:true})
  quantityUnits?:string;// g,ml, kg, tsp

}
