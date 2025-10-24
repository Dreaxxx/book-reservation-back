import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';

jest.mock('argon2', () => ({
  hash: jest.fn(),
  verify: jest.fn(),
}));

type Mocked<T> = {
  [K in keyof T]: jest.MockedFunction<any>;
};

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Mocked<Pick<UsersService, 'findByEmail' | 'create'>>;
  let jwtService: Mocked<Pick<JwtService, 'sign'>>;

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    jwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get(AuthService);
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('signup a new user and return a token if successful', async () => {
      usersService.findByEmail.mockResolvedValue(null);
      (argon2.hash as jest.Mock).mockResolvedValue('hashed_pw');
      usersService.create.mockResolvedValue({
        id: '1',
        email: 'john@doe.com',
        password: 'hashed_pw',
        name: 'John',
      });
      jwtService.sign.mockReturnValue('jwt-token');

      const res = await service.signup('john@doe.com', 'plain_pw', 'John');

      expect(usersService.findByEmail).toHaveBeenCalledWith('john@doe.com');
      expect(argon2.hash).toHaveBeenCalledWith('plain_pw');
      expect(usersService.create).toHaveBeenCalledWith({
        email: 'john@doe.com',
        password: 'hashed_pw',
        name: 'John',
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: '1',
        email: 'john@doe.com',
      });
      expect(res).toEqual({
        accessToken: 'jwt-token',
        user: { id: '1', email: 'john@doe.com' },
      });
    });

    it("conflictException if email already used", async () => {
      usersService.findByEmail.mockResolvedValue({ id: 'u1' } as any);

      await expect(
        service.signup('john@doe.com', 'pw', 'John'),
      ).rejects.toBeInstanceOf(ConflictException);

      expect(usersService.findByEmail).toHaveBeenCalledWith('john@doe.com');
      expect(argon2.hash).not.toHaveBeenCalled();
      expect(usersService.create).not.toHaveBeenCalled();
      expect(jwtService.sign).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('authenticate and return the user and the token if credentials are valid', async () => {
      usersService.findByEmail.mockResolvedValue({
        id: '2',
        email: 'jane@doe.com',
        password: 'hashed_pw',
      } as any);
      (argon2.verify as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockReturnValue('jwt-token-2');

      const res = await service.login('jane@doe.com', 'plain_pw');

      expect(usersService.findByEmail).toHaveBeenCalledWith('jane@doe.com');
      expect(argon2.verify).toHaveBeenCalledWith('hashed_pw', 'plain_pw');
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: '2',
        email: 'jane@doe.com',
      });
      expect(res).toEqual({
        accessToken: 'jwt-token-2',
        user: { id: '2', email: 'jane@doe.com' },
      });
    });

    it("UnauthorizedException if user doesn't exist", async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.login('ghost@doe.com', 'pw'),
      ).rejects.toBeInstanceOf(UnauthorizedException);

      expect(argon2.verify).not.toHaveBeenCalled();
      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    it('UnauthorizedException if invalid password', async () => {
      usersService.findByEmail.mockResolvedValue({
        id: '3',
        email: 'jack@doe.com',
        password: 'hashed_pw',
      } as any);
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login('jack@doe.com', 'wrong_pw'),
      ).rejects.toBeInstanceOf(UnauthorizedException);

      expect(argon2.verify).toHaveBeenCalledWith('hashed_pw', 'wrong_pw');
      expect(jwtService.sign).not.toHaveBeenCalled();
    });
  });

  describe('verify the payload', () => {
    it('use credentials to sign the token', async () => {
      usersService.findByEmail.mockResolvedValue(null);
      (argon2.hash as jest.Mock).mockResolvedValue('hashed_pw');
      usersService.create.mockResolvedValue({
        id: '4',
        email: 'sign@test.com',
        password: 'hashed_pw',
      });
      jwtService.sign.mockReturnValue('token-4');

      const res = await service.signup('sign@test.com', 'pw');

      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: '4',
        email: 'sign@test.com',
      });
      expect(res.accessToken).toBe('token-4');
    });
  });
});
