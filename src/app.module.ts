import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TagModule } from './modules/tag/tag.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import ormconfig from './ormconfig';
import { AuthMiddleware } from './modules/user/middlewares/auth.middleware';

@Module({
  imports: [TagModule, TypeOrmModule.forRoot(ormconfig), UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer:MiddlewareConsumer){
    consumer.apply(AuthMiddleware).forRoutes({
      path:'*',
      method:RequestMethod.ALL
    })
  }
}
