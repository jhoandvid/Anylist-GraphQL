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
      introspection:process.env.STATE!=='prod',
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),


    TypeOrmModule.forRoot({



      type: 'postgres',
      ssl:(process.env.STATE==='prod')?{rejectUnauthorized:false, sslmode:'require'}:false as any,
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
export class AppModule {

  constructor(){
    console.log(process.env.STATE)
    console.log(process.env.DB_HOST)
    console.log(process.env.DB_PORT)
    console.log(process.env.DB_USERNAME)
    console.log(process.env.DB_PASSWORD)
    console.log(process.env.DB_NAME)
    console.log(process.env.PORT)



  }

}
