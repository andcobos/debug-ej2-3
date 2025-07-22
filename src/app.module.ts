import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product/product.entity';
import { ProductModule } from './product/product.module';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheConfigService } from './cache/cache.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Colita2010',
      database: 'debugredis',
      entities: [Product],
      synchronize: true,
    }),
    CacheModule.registerAsync({
      useClass: CacheConfigService,
      isGlobal: true,
    }),
    ProductModule,
  ],
})
export class AppModule {}
