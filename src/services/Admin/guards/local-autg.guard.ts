import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LocalNames } from 'src/constants/authLocalNames';

@Injectable()
export class LocalAuthGuard extends AuthGuard(LocalNames.LOCAL_ADMIN) {}
