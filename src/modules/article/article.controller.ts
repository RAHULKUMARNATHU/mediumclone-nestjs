import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { User } from '../user/decorators/user.decorator';
import { UserEntity } from '../user/entities/user.entity';
import { AuthGuard } from '../user/guards/auth.guard';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleResponseInterface } from './types/articleResponse.interface';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  @Post('/create')
  async create(@User()currentUser:UserEntity, @Body('article') createArticleDto: CreateArticleDto) :Promise<ArticleResponseInterface>{
    const article =await this.articleService.createArticle(currentUser,createArticleDto);
    return this.articleService.buildArticleResponse(article);
  }

  @Get()
  findAll() {
    return this.articleService.findAll();
  }

  @Get('/:slug')
  async getSingleArticle(@Param('slug') slug: string) :Promise<ArticleResponseInterface>{
    const article = await this.articleService.findBySlug(slug);
    return this.articleService.buildArticleResponse(article);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(+id, updateArticleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleService.remove(+id);
  }
}
