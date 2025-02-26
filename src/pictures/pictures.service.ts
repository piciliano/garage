import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class PicturesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(file: Express.Multer.File) {
    try {
      const supaBaseUrl = process.env.SUPABASE_URL as string;
      const supaBaseKey = process.env.SUPABASE_KEY as string;
      const supabase = createClient(supaBaseUrl, supaBaseKey, {
        auth: {
          persistSession: false,
        },
      });

      const result = await supabase.storage
        .from('garage')
        .upload(file.originalname, file.buffer, {
          upsert: true,
        });

      if (result.error) {
        throw new Error(result.error.message);
      }

      const publicUrl = supabase.storage
        .from('garage')
        .getPublicUrl(file.originalname).data.publicUrl;

      if (!publicUrl) {
        throw new Error('Erro ao obter a URL da imagem');
      }

      const savedData = await this.prisma.picture.create({
        data: {
          link: publicUrl,
        },
      });

      return savedData;
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
