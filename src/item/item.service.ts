import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Repository} from 'typeorm'
import { Item } from './entities/item.entity';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { NotFoundException } from '@nestjs/common/exceptions';

@Injectable()
export class ItemService {
 
 constructor(
  @InjectRepository(Item)
  private readonly itemsRepository:Repository<Item>
 ){

 }

  async create(createItemInput: CreateItemInput) {
    const newItem=this.itemsRepository.create(createItemInput);
    return await this.itemsRepository.save(newItem);
  }

  async findAll() {
    return await this.itemsRepository.find();
  }

  async findOne(id: string) {

    const item= await this.itemsRepository.findOneBy({id});

    if(!item){
      throw new NotFoundException(`not found item with id ${id}`)
    }
    return item
  }

  async update(id:string, updateItemInput: UpdateItemInput):Promise<Item> {

  await this.findOne(id);
  const item= await this.itemsRepository.preload({id, ...updateItemInput});

  return this.itemsRepository.save(item );
  }

  async remove(id: string) {

   await this.findOne(id);

   try{
     await this.itemsRepository.update(id,{isActive:false});
   }catch(err){
      console.log(err);
   }
    return `the item with id ${id} remove`;
  }
}
