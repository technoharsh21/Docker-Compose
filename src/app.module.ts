import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserService } from './user.service';
import { User } from './user.entity';
import { RedisModule, RedisService } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Harsh@2123',
      database: 'docker_compose',
      autoLoadEntities: true,
      synchronize: true,
    }),
    RedisModule.forRoot({
      config: {
        host: 'localhost', // Redis server host
        port: 6379, // Redis server port
      },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [UserService],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly dataSource: DataSource,
    private readonly redisService: RedisService,
  ) {}

  async onModuleInit() {
    // PostgreSQL connection
    if (!this.dataSource.isInitialized) {
      try {
        await this.dataSource.initialize();
        console.log('PostgreSQL database connected');
      } catch (error) {
        console.error(
          `Error connecting to the PostgreSQL database: ${error}`,
          error,
        );
        return;
      }
    } else {
      console.log('PostgreSQL database  connected');
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
