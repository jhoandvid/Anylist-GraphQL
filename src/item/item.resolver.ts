import { Resolver, Query, Mutation, Args, Int, ID, } from '@nestjs/graphql';
import { ItemService } from './item.service';
import { Item } from './entities/item.entity';
import { UpdateItemInput, CreateItemInput } from './dto/inputs';
import { ParseUUIDPipe } from '@nestjs/common/pipes';

@Resolver(() => Item)
export class ItemResolver {
  constructor(private readonly itemService: ItemService) {}

  @Mutation(() => Item)
  async createItem(@Args('createItemInput') createItemInput: CreateItemInput):Promise<Item> {
    return this.itemService.create(createItemInput);
  }

  @Query(() => [Item], { name: 'items' })
  findAll():Promise<Item[]> {
    return this.itemService.findAll();
  }

  @Query(() => Item, { name: 'item' })
  findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string):Promise<Item> {
    return this.itemService.findOne(id);
  }

  @Mutation(() => Item)
  updateItem(@Args('updateItemInput') updateItemInput: UpdateItemInput):Promise<Item> {
    return this.itemService.update(updateItemInput.id, updateItemInput);
  }

  @Mutation(()=>String)
  removeItem(@Args('id', { type: () => ID }) id: string) {
    return this.itemService.remove(id);
  }
}
