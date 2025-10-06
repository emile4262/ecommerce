import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/features/users/users.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService, // ✅ injection ici
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!, // ✅ "!" => non null assertion
    });

    // console.log(
    //   'JWT_SECRET utilisé par JwtStrategy:',
    //   this.configService.get<string>('JWT_SECRET'),
    // );
  }

  async validate(payload: any) {
    if (!payload.role) {
      throw new UnauthorizedException('Information de rôle manquante');
    }

    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
