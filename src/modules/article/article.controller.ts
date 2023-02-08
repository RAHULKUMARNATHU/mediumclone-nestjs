import { BackendValidationPipe } from 'src/shared/pipes/backendValidation.pipe';
import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseGuards, Put, Query } from '@nestjs/common';
import { User } from '../user/decorators/user.decorator';
import { UserEntity } from '../user/entities/user.entity';
import { AuthGuard } from '../user/guards/auth.guard';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleResponseInterface } from './types/articleResponse.interface';
import { ArticlesResponseInterface } from './types/articlesResponse.interface';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async findAll(@User('id')currentUserId:number , @Query()query:any):Promise<ArticlesResponseInterface>{
    return await this.articleService.findAll(currentUserId , query);
  }

  @UseGuards(AuthGuard)
  @Get('feed')
  async getFeed(@User('id')currentUserId:number , @Query () query :any):Promise<ArticlesResponseInterface>{
    return await this.articleService.getFeed(currentUserId , query);
  }

  @UsePipes(new BackendValidationPipe())
  @UseGuards(AuthGuard)
  @Post('/create')
  async create(@User()currentUser:UserEntity, @Body('article') createArticleDto: CreateArticleDto) :Promise<ArticleResponseInterface>{
    const article =await this.articleService.createArticle(currentUser,createArticleDto);
    return this.articleService.buildArticleResponse(article);
  }

  @Get('/:slug')
  async getSingleArticle(@Param('slug') slug: string) :Promise<ArticleResponseInterface>{
    const article = await this.articleService.findBySlug(slug);
    return this.articleService.buildArticleResponse(article);
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  async deleteArticle(@User('id')currentUserId:number,@Param('slug') slug: string) {
    return await this.articleService.deleteArticle(currentUserId,slug )
  }

  @Put(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async updateArticle(@User('id')currentUserId:number,@Param('slug') slug: string, @Body('article') updateArticleDto: UpdateArticleDto):Promise<ArticleResponseInterface> {
   const article =await this.articleService.updateArticle( slug,updateArticleDto,currentUserId );
    return  this.articleService.buildArticleResponse(article);
  }


  @Post('/:slug/favorite')
  @UseGuards(AuthGuard)
  async addArticleToFavorites(@User('id')currentUserId:number , @Param('slug')slug:string):Promise<ArticleResponseInterface>{
    const article = await this.articleService.addArticleToFavorites(slug , currentUserId)
    return this.articleService.buildArticleResponse(article)
  }

  @Delete('/:slug/favorite')
  @UseGuards(AuthGuard)
  async deleteArticleFromFavorites(@User('id')currentUserId:number , @Param('slug')slug:string):Promise<ArticleResponseInterface>{
    const article = await this.articleService.deleteArticleFromFavorites(slug , currentUserId)
    return this.articleService.buildArticleResponse(article)
  }
  // @Get()
  // findAll() {
  //   return this.articleService.findAll();
  // }
 
}
