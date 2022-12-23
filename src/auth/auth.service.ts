import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import validate from 'validator';
import { messages } from '../constants';
import { Role } from '../enums/role.enum';
import { UserEntity } from '../modules/users/users.entity';
import { RegiterDto, LoginDto } from './dto/auth.dto';
import { RefreshToken } from './refresh-token.entity';
import { v4 as uuid } from 'uuid';
import { validateOrReject } from 'class-validator';
import { AppConfiguration } from '../config/app.config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
  ) {}

  async register(
    registerDto: RegiterDto,
  ): Promise<Record<string, string | number>> {
    try {
      // Validate the registerDto object
      await validateOrReject(registerDto);

      // Check if user with desired username already exists
      const existingUser = await this.userRepository.findOne({
        username: registerDto.username,
      });

      if (existingUser) {
        throw new BadRequestException(messages.error.USER_EXISTS);
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(
        registerDto.password,
        AppConfiguration.bcrypt.salt,
      );
      registerDto.password = hashedPassword;

      // Save user to database and return success message with user ID
      const savedUser = await this.userRepository.save(registerDto);

      const accessToken = this.jwtService.sign({
        userId: savedUser.id,
        username: savedUser.username,
        userRole: savedUser.role || Role.User,
      });

      const refreshToken = await this.createRefreshToken(savedUser.id);

      // Return the success message and the access token.
      return {
        message: messages.info.REGISTER_SUCCESS,
        userId: savedUser.id,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      // Handle errors
      if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Error while registering user');
      }
    }
  }

  async authenticateUser(loginDto: LoginDto): Promise<Record<string, string>> {
    const { username, password } = loginDto;

    // Check if the 'username' is an email address.
    const isEmail = validate.isEmail(username);

    try {
      // Find the user with the given 'username' or 'email', depending on the value of 'isEmail'.
      const user = await this.userRepository.findOne({
        [isEmail ? 'email' : 'username']: username,
      });

      // If no user was found, throw an error.
      if (!user) {
        throw new Error(messages.error.INVALID_USERNAME);
      }

      // Compare the given 'password' with the hashed password stored in the database for the user.
      const isValidPassword = await bcrypt.compare(password, user.password);

      // If the passwords don't match, throw an error.
      if (!isValidPassword) {
        throw new Error(messages.error.INVALID_PASSWORD);
      }

      const accessToken = this.jwtService.sign({
        userId: user.id,
        username: user.username,
        userRole: user.role || Role.User,
      });

      const refreshToken = await this.createRefreshToken(user.id);

      // Return the success message and the access token.
      return {
        message: messages.info.LOGIN_SUCCESS,
        accessToken,
        refreshToken: refreshToken,
      };
    } catch (error) {
      // Handle errors
      throw new BadRequestException(error.message);
    }
  }

  async createRefreshToken(userId: number): Promise<string> {
    // Generate a new refresh token
    const refreshToken = new RefreshToken();
    refreshToken.token = uuid();
    refreshToken.userId = userId;
    refreshToken.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

    // Save the refresh token to the database
    await this.refreshTokenRepository.save(refreshToken);

    // Return the refresh token value
    return refreshToken.token;
  }

  async refresh(refreshToken: string): Promise<string> {
    try {
      // Look up the refresh token in the database
      const token = await this.refreshTokenRepository.findOne({
        token: refreshToken,
      });

      // If the token is not found or has expired, throw an error
      if (!token || token.expiresAt < new Date()) {
        throw new Error('Invalid or expired refresh token');
      }

      const user = await this.userRepository.findOne(token.userId);

      // Generate a new access token
      const accessToken = this.jwtService.sign({
        userId: token.userId,
        username: user.username,
        userRole: user.role || Role.User,
      });

      // Return the new access token
      return accessToken;
    } catch (error) {
      // Handle the error
      throw new BadRequestException(error.message);
    }
  }
}
