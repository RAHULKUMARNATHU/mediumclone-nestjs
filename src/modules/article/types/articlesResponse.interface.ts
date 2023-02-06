import { ArticleEntity } from "../entities/article.entity";

export interface ArticlesResponseInterface{
    articles:ArticleEntity[];
    articlesCount:number;
}