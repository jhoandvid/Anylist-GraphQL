import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloDriver } from '@nestjs/apollo/dist/drivers';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { ItemModule } from './item/item.module';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [

    ConfigModule.forRoot(),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground:false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),


    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize:true,
      autoLoadEntities: true

    }),


    ItemModule,

  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
