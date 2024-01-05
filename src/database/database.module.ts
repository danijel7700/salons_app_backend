import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AvailableConfigs } from "src/enums/environment.enum";

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            uri: configService.get<string>(AvailableConfigs.DATABASE_URI),
          }),
          inject: [ConfigService],
        }),
      ],
})
export class DatabaseModule{}