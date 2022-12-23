import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @ApiProperty({ type: String })
  readonly username: string;

  @IsNotEmpty()
  @ApiProperty({ type: String })
  readonly password: string;
}

export class RegiterDto {
  @IsNotEmpty()
  @ApiProperty({ type: String })
  username: string;

  @IsNotEmpty()
  @ApiProperty({ type: String })
  password: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ type: String })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ type: String })
  fullName: string;
}

export class RefreshTokenDto {
  @IsString()
  @ApiProperty({ type: String })
  readonly refreshToken: string;
}
