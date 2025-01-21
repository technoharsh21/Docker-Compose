import { Module, OnModuleInit } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { RedisModule, RedisService } from '@liaoliaots/nestjs-redis';
import { Repository } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost', // default to localhost
      port: parseInt(process.env.DB_PORT ?? '5432', 10), // default to 5432
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'Harsh@2123',
      database: process.env.DB_NAME || 'docker_compose',
      autoLoadEntities: true,
      synchronize: true,
    }),

    RedisModule.forRoot({
      config: {
        host: process.env.REDIS_HOST, // Redis server host
        port: parseInt(process.env.REDIS_PORT ?? '6379', 10), // Redis server port
        password: process.env.REDIS_PASSWORD,
      },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly redisService: RedisService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    // Inside your onModuleInit() or any method
    try {
      await this.userRepository.createQueryBuilder().getMany(); // Simple query to check connection
      console.log('Database is connected');
    } catch (error) {
      console.error('Database connection error:', error);
    }

    // Redis connection
    try {
      const client = this.redisService.getClient();
      await client.set('testKey', 'testValue');
      const testValue = await client.get('testKey');
      if (testValue === 'testValue') {
        console.log('Redis is connected and operational');
      } else {
        throw new Error('Redis test operation failed');
      }
    } catch (redisError) {
      console.error(`Redis connection failed: ${redisError}`, redisError);
    }
  }
}
