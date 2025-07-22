import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepo.create(createProductDto);
    const savedProduct = await this.productRepo.save(product);
    
    await this.cacheManager.del('products_all');
    console.log('Cache cleared after creating new product');
    
    return savedProduct;
  }

  async findAll(): Promise<Product[]> {
    const cacheKey = 'products_all';
    
    try {
      const cached = await this.cacheManager.get<Product[]>(cacheKey);
      if (cached) {
        console.log('Data retrieved from cache');
        return cached;
      }
    } catch (error) {
      console.log('Cache error:', error);
    }
    
    console.log('Data retrieved from database');
    const data = await this.productRepo.find();
    
    try {
      await this.cacheManager.set(cacheKey, data, 30000);
    } catch (error) {
      console.log('Error setting cache:', error);
    }

    return data;
  }
}
