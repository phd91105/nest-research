import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AppConfiguration } from '../config/app.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: AppConfiguration.jwt.secret,
    });
  }

  validate(
    payload: Record<string, string | number>,
  ): Record<string, string | number> {
    const { role, uname, uid } = payload;
    return {
      uid: uid,
      uname: uname,
      role: role,
    };
  }
}
