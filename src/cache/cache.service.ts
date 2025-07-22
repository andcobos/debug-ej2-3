import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';
import { redisStore } from 'cache-manager-ioredis-yet';

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  createCacheOptions(): CacheModuleOptions {
    return {
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: 30000, // 30 seconds in milliseconds
      max: 100, // maximum number of items in cache
    };
  }
}
