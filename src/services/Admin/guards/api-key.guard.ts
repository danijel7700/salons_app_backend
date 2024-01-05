import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AvailableConfigs } from 'src/enums/environment.enum';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const apiKey = request.headers['x-api-key'];

    if (!apiKey) {
      throw new UnauthorizedException('API key nedostaje.');
    }

    if (apiKey !== this.configService.get(AvailableConfigs.API_KEY)) {
      throw new UnauthorizedException('Invalid API key.');
    }

    return true;
  }
}
