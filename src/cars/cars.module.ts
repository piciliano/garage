import { Module } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [CarsController],
  providers: [CarsService],
})
export class CarsModule {}
