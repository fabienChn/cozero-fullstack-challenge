import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Project } from './projects/entities/project.entity';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { AuthModule } from './auth/auth.module';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AuthService } from './auth/auth.service';
import { UserLoginDto } from './users/dto/user-login.dto';

export async function initTestServer(): Promise<INestApplication> {
  const moduleRef = await Test.createTestingModule({
    imports: [
      AppModule,
      TypeOrmModule.forRoot({
        entities: [Project, User],
        type: 'mysql',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      }),
      UsersModule,
      ProjectsModule,
      AuthModule,
    ],
    providers: [
      AppService,
      {
        provide: APP_GUARD,
        useClass: JwtAuthGuard, // Set authorization guard for all routes
      },
    ],
  }).compile();

  const app: INestApplication = moduleRef.createNestApplication();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  return app;
}

export async function generateAccessToken(
  authService: AuthService,
  credentials?: UserLoginDto,
) {
  const loginResponse = await authService.login({
    email: credentials?.email ?? 'test@test.fr',
    password: credentials?.password ?? '1234',
  });

  return loginResponse.access_token;
}
