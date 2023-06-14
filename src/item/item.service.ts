import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { NotFoundException } from '@nestjs/common/exceptions';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
  ) {}

  async create(createItemInput: CreateItemInput, user: User) {
    const newItem = this.itemsRepository.create({
      ...createItemInput,
      user,
    });
    return await this.itemsRepository.save(newItem);
  }

  async findAll(user: User) {
    return await this.itemsRepository.find({
      where: { user: { id: user.id } },
    });
  }

  async findOne(id: string, user: User) {
    const item = await this.itemsRepository.findOneBy({
      id,
      user: { id: user.id },
    });

    if (!item) {
      throw new NotFoundException(`not found item with id ${id}`);
    }
    return item;
  }

  async update(
    id: string,
    updateItemInput: UpdateItemInput,
    user: User,
  ): Promise<Item> {
    await this.findOne(id, user);
    const item = await this.itemsRepository.preload({ id, ...updateItemInput });

    return this.itemsRepository.save(item);
  }

  async remove(id: string, user: User) {
    await this.findOne(id, user);

    try {
      await this.itemsRepository.update(id, { isActive: false });
    } catch (err) {
      console.log(err);
    }
    return `the item with id ${id} remove`;
  }

  async itemCountByUser(user: User): Promise<number> {
    return this.itemsRepository.count({
      where: {
        user: {
          id: user.id,
        },
      },
    });
  }
}
