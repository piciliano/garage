import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Car } from '@prisma/client';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';

@Injectable()
export class CarsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createCarDto: CreateCarDto,
    tokenPayload: TokenPayloadDto,
  ): Promise<Car> {
    try {
      return this.prisma.car.create({
        data: {
          ...createCarDto,
          userId: tokenPayload.id,
        },
      });
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error creating user',
          error: error.message || 'unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findAll() {
    return this.prisma.car.findMany();
  }

  async findOne(id: string): Promise<Car> {
    try {
      const car = await this.prisma.car.findUnique({
        where: {
          id: id,
        },
      });

      if (!car) {
        throw new NotFoundException('No car found');
      }

      return car;
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error creating user',
          error: error.message || 'unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  update(id: number, updateCarDto: UpdateCarDto) {
    return `This action updates a #${id} car`;
  }

  async remove(id: string) {
    try {
      const car = await this.findOne(id);

      if (car) {
        return this.prisma.car.delete({
          where: {
            id,
          },
        });
      }
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error creating user',
          error: error.message || 'unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
