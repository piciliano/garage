import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { CarsModule } from './cars/cars.module';
import { PrismaModule } from 'prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PicturesModule } from './pictures/pictures.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(process.cwd(), 'pictures'),
      serveRoot: '/pictures',
    }),
    CarsModule,
    PrismaModule,
    UsersModule,
    AuthModule,
    PicturesModule,
  ],
})
export class AppModule {}
