import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateSeedInput } from './dto/create-seed.input';
import { UpdateSeedInput } from './dto/update-seed.input';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/item/entities/item.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { SEED_ITEMS, SEED_USERS } from './data/seed-data';
import { UsersService } from 'src/users/users.service';
import { ItemService } from 'src/item/item.service';

@Injectable()
export class SeedService {
  private isProd: boolean;
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly userService: UsersService,

    private readonly itemService: ItemService,
  ) {
    this.isProd = this.configService.get('STATE') === 'prod';
  }
  async executeSeed() {
    if (this.isProd) {
      throw new UnauthorizedException('We cannot run SEED on Prod');
    }

    //Limpiar la base de datos
    await this.deleteDatabase();

    return true;
  }

  async deleteDatabase() {
    Promise.all([
      await this.itemsRepository
        .createQueryBuilder()
        .delete()
        .where({})
        .execute(),
      await this.userRepository
        .createQueryBuilder()
        .delete()
        .where({})
        .execute(),
    ]);

    //crear usuarip
    const user = await this.loadUsers();
    await this.loadItems(user);
  }

  async loadUsers(): Promise<User> {
    const users = [];

    for (const user of SEED_USERS) {
      users.push(await this.userService.create(user));
    }

    return users[0];
  }

  async loadItems(user: User): Promise<void> {
    const items = [];

    for (const item of SEED_ITEMS) {
      items.push(await this.itemService.create({ ...item }, user));
    }
    await Promise.all(items);
  }
}
