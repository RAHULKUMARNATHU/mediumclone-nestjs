import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './entities/article.entity';
import { UserEntity } from '../user/entities/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([ArticleEntity , UserEntity])],
  controllers: [ArticleController],
  providers: [ArticleService ]
})
export class ArticleModule {}
