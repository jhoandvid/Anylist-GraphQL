import { ExecutionContext } from '@nestjs/common/interfaces';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(contex: ExecutionContext) {
    const ctx = GqlExecutionContext.create(contex);
    const request = ctx.getContext().req;
    return request;
  }
}
