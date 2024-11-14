import { MiddlewareConsumer, Module } from '@nestjs/common';
import { PrismaModule } from '@/modules/prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validationSchema } from '@/config/config.schema';
import { appConfig, jwtConfig, nodeConfig, postgresConfig, prismaConfig, redisConfig } from '@/config/configs';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { ResponseLoggingMiddleware } from './middleware/response-logging-middlware';
import { RequestLoggingMiddleware } from './middleware/request-logging-middlware';
import { UserModule } from './modules/user/user.module';
import { JwtModule } from './modules/jwt/jwt.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      load: [appConfig, jwtConfig, nodeConfig, postgresConfig, prismaConfig, redisConfig],
      cache: true,
      envFilePath: '.env',
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('redis').host,
        port: configService.get('redis').portExternal,
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
    UserModule,
    JwtModule,
    AuthModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggingMiddleware, ResponseLoggingMiddleware).forRoutes('*');
  }
}
