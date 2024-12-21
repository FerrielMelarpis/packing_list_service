import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PackingListModule } from './packing-list/packing-list.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'packinglist.db',
      entities: [__dirname + '/**/*.entity{.js,.ts}'],
      synchronize: process.env.NODE_ENV == 'dev',
    }),
    PackingListModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
