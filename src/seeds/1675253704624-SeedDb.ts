import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDb1675253704624 implements MigrationInterface {
  name = 'SeedDb1675253704624';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO tags (name) VALUES ('dragons'), ('coffee' ),('nestjs')`,
    );

    await queryRunner.query(
        //password :123
      `INSERT INTO users (username , email , password ) VALUES ('user' , 'user@gmail.com', '$2b$10$MOUyxE5xvnlbYB3EfEe9UeqKDyETYoR75vmJGJRPb1wb2TM4wKv42'),('test' , 'test@gmail.com', '$2b$10$MOUyxE5xvnlbYB3EfEe9UeqKDyETYoR75vmJGJRPb1wb2TM4wKv42')`,
    );
    //tagList -- db supports====taglist
    await queryRunner.query(
      `INSERT INTO articles (slug , title , description, body , "tagList" , "authorId") VALUES ('first-article','First article', 'First article description' , 'First article body','coffee,dragons',1 ),('second-article','Second article', 'Second article description' , 'Second article body','coffee,dragons',1 ),('third-article','Third article', 'Third article description' , 'Third article body','fooo,coffee,dragons',2 )`,
    );
  }

  public async down(): Promise<void> {}
}
