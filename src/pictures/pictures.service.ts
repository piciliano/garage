import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';
import { randomUUID } from 'crypto';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PicturesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(file: Express.Multer.File, tokenPayload: TokenPayloadDto) {
    try {
      const fileExtension = path
        .extname(file.originalname)
        .toLocaleLowerCase()
        .substring(1);

      const fileName = `${randomUUID()}.${fileExtension}`;
      const fileFullPath = path.resolve(process.cwd(), 'pictures', fileName);

      await fs.writeFile(fileFullPath, file.buffer);

      const link = `http://localhost:4000/pictures/${fileName}`;

      await this.prisma.picture.create({
        data: {
          link,
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

  async findAll() {
    return this.prisma.picture.findMany();
  }
}
