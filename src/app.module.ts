import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TagModule } from './modules/tag/tag.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import ormconfig from './ormconfig';

@Module({
  imports: [TagModule, TypeOrmModule.forRoot(ormconfig), UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
