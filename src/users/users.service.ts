import {
  Injectable,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { SigupInput } from '../auth/dto/inputs/signup.input';
import { CreateUserInput } from './dto/create-user.input';
import { ValidRoles } from '../auth/enums/valid-roles.enum';

@Injectable()
export class UsersService {
  private logger: Logger = new Logger('usersService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(sigupInput: SigupInput): Promise<User> {
    const user = this.userRepository.create({
      ...sigupInput,
      password: bcrypt.hashSync(sigupInput.password, 10),
    });
    try {
      return await this.userRepository.save(user);
    } catch (error) {
      this.handlerDBError(error);
    }
  }

  async findAll(roles: ValidRoles[]): Promise<User[]> {
    if (roles.length === 0) {
      return this.userRepository.find();
    }
    return this.userRepository
      .createQueryBuilder()
      .andWhere('ARRAY[roles] && ARRAY[:...roles]')
      .setParameter('roles', roles)
      .getMany();
  }

  async findOneById(id: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ id });
    } catch (error) {
      this.handlerDBError({ code: 'error-001', detail: `${id} not found` });
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ email });
    } catch (error) {
      this.handlerDBError({ code: 'error-001', detail: `${email} not found` });
    }
  }

  async update(
    id: string,
    updateUserInput: UpdateUserInput,
    userReq: User,
  ): Promise<User> {
    try {
      const user = await this.userRepository.preload({
        ...updateUserInput,
        id,
      });
      user.lastUpdateBy = userReq;
      return await this.userRepository.save(user);
    } catch (error) {
      this.handlerDBError(error);
    }
  }

  async block(id: string, user: User): Promise<User> {
    const userToBlock = await this.findOneById(id);
    userToBlock.isActive = false;
    user.id = '';
    userToBlock.lastUpdateBy = user;
    return await this.userRepository.save(userToBlock);
  }

  private handlerDBError(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail.replace('Key ', ''));
    }

    if (error.code == 'error-001')
      throw new BadRequestException(error.detail.replace('Key ', ''));

    this.logger.error(error);
    throw new InternalServerErrorException(`Plase check server logs`);
  }
}
