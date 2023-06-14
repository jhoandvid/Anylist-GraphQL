import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ItemModule } from 'src/item/item.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ItemModule],

  exports: [UsersService, TypeOrmModule],

  providers: [UsersResolver, UsersService],
})
export class UsersModule {}
