import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { DeleteResult, Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleEntity } from './entities/article.entity';
import { ArticleResponseInterface } from './types/articleResponse.interface';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
  ) {}

  async createArticle(
    currentUser: UserEntity,
    createArticleDto: CreateArticleDto,
  ) {
    const article = new ArticleEntity();
    Object.assign(article, createArticleDto);
    if (!article.tagList) {
      article.tagList = [];
    }
    article.slug = this.getSlug(createArticleDto.title);
    article.author = currentUser;
    return await this.articleRepository.save(article);
  }

  buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
    return { article };
  }

  private getSlug(title: string): string {
    return slugify(
      title,
      { lower: true }) +
        '-' +
        ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
  }
  
  
  async findBySlug(slug:string):Promise<ArticleEntity >{
    return await this.articleRepository.findOne({where:{slug}})
  }

  async deleteArticle(currentUserId:number , slug: string):Promise<DeleteResult>{
    const article = await this.findBySlug(slug);
    if(!article){
      throw new HttpException('Article does not exist' , HttpStatus.NOT_FOUND)
    }
    if(article.author.id !== currentUserId){
      throw new HttpException('You are not authentic author' , HttpStatus.FORBIDDEN)
    }
    return this.articleRepository.delete({slug})
  }


  async updateArticle(slug:string, updateArticleDto: UpdateArticleDto,currentUserId: number):Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);
    if(!article){
      throw new HttpException('Article does not exist' , HttpStatus.NOT_FOUND)
    }
    if(article.author.id !== currentUserId){
      throw new HttpException('You are not authentic author' , HttpStatus.FORBIDDEN)
    }
    Object.assign(article,updateArticleDto);
    return await this.articleRepository.save(article);
  }

  findAll() {
    return `This action returns all article`;
  }

  

 

}
