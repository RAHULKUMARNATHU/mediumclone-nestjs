import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { DataSource, DeleteResult, Like, Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleEntity } from './entities/article.entity';
import { ArticleResponseInterface } from './types/articleResponse.interface';
import { ArticlesResponseInterface } from './types/articlesResponse.interface';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private dataSource: DataSource,
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
    return (
      slugify(title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }

  async findBySlug(slug: string): Promise<ArticleEntity> {
    return await this.articleRepository.findOne({ where: { slug } });
  }

  async addArticleToFavorites(
    slug: string,
    userId: number,
  ): Promise<ArticleEntity> {
    const article = await this.articleRepository.findOne({ where: { slug } });
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favorites'],
    });

    const isNotFavorited =
      user.favorites.findIndex(
        (articleInFavorites) => articleInFavorites.id === article.id,
      ) === -1;

    if (isNotFavorited) {
      user.favorites.push(article);
      article.favoriteCount++;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }

    return article;
  }

  async deleteArticleFromFavorites(
    slug: string,
    userId: number,
  ): Promise<ArticleEntity> {
    const article = await this.articleRepository.findOne({ where: { slug } });
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favorites'],
    });

    const articleIndex = user.favorites.findIndex(
      (articleInFavorites) => articleInFavorites.id === article.id,
    );

    if (articleIndex >= 0) {
      user.favorites.splice(articleIndex, 1);
      article.favoriteCount--;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }
    return article;
  }

  async deleteArticle(
    currentUserId: number,
    slug: string,
  ): Promise<DeleteResult> {
    const article = await this.findBySlug(slug);
    if (!article) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    }
    if (article.author.id !== currentUserId) {
      throw new HttpException(
        'You are not authentic author',
        HttpStatus.FORBIDDEN,
      );
    }
    return this.articleRepository.delete({ slug });
  }

  async updateArticle(
    slug: string,
    updateArticleDto: UpdateArticleDto,
    currentUserId: number,
  ): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);
    if (!article) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    }
    if (article.author.id !== currentUserId) {
      throw new HttpException(
        'You are not authentic author',
        HttpStatus.FORBIDDEN,
      );
    }
    Object.assign(article, updateArticleDto);
    return await this.articleRepository.save(article);
  }

  async findAll(
    currentUserId: number,
    query: any,
  ): Promise<ArticlesResponseInterface> {
    const queryBuilder = this.dataSource
      .getRepository(ArticleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author');

    if (query.author) {
      const author = await this.userRepository.findOne({
        where: { username: query.author },
      });
      if (!author) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      queryBuilder.andWhere('articles.authorId = :id', {
        id: author.id,
      });
    }

    // if (query.tag) {
    //   queryBuilder.andWhere('articles.tagList LIKE :tag', {
    //     tag: `%${query.tag}`,
    //   });
    // }
    if (query.tag) {
      queryBuilder.andWhere([
        { tagList: Like(`%${query.tag}`) },
        // { tagList: Like('%node%') },
      ]);
    }

    queryBuilder.orderBy('articles.createdAt', 'DESC');
    const articlesCount = await queryBuilder.getCount();
    if (query.limit) {
      queryBuilder.limit(query.limit);
    }

    if (query.offset) {
      queryBuilder.offset(query.offset);
    }
    const articles = await queryBuilder.getMany();

    return { articles, articlesCount };
  }
}
