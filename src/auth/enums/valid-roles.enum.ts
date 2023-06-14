import { registerEnumType } from '@nestjs/graphql';

export enum ValidRoles {
  admin = 'admin',
  user = 'user',
  superUser = 'superUser',
}

/* export enum Nombres {
  juan = 'juan',
  carlos = 'carlos',
} */

registerEnumType(ValidRoles, { name: 'ValidRoles' });
/* 
registerEnumType(Nombres, { name: 'Nombre' }); */
