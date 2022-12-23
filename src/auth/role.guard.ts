import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { decode, JsonWebTokenError } from 'jsonwebtoken';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(executionContext: ExecutionContext): Promise<boolean> {
    const httpRequest = executionContext.switchToHttp().getRequest();
    if (
      !httpRequest ||
      !httpRequest.headers ||
      !httpRequest.headers.authorization
    ) {
      throw new BadRequestException('Invalid request');
    }

    try {
      // Get required roles from the handler metadata
      const requiredRoles = this.reflector.get<string[]>(
        'roles',
        executionContext.getHandler(),
      );

      // Extract and decode the access token from the request headers
      const token = httpRequest.headers.authorization.split(' ').pop();
      const decodedToken = decode(token);

      // Check if the user has the required role
      if (requiredRoles.includes(decodedToken['userRole'])) {
        return true;
      } else {
        throw new UnauthorizedException('User does not have the required role');
      }
    } catch (error) {
      // Handle errors
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Invalid or expired access token');
      } else {
        throw error;
      }
    }
  }
}
