import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GuardsNames } from 'src/constants/authGuardNames';

@Injectable()
export class JwtAuthGuardUser extends AuthGuard(GuardsNames.JWT_USER) {}