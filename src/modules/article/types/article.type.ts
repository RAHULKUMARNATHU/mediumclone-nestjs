import { ArticleEntity } from "../entities/article.entity";
export type ArticleType  = Omit<ArticleEntity , 'UpdateTimestamp'>