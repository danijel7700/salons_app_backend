import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GuardsNames } from 'src/constants/authGuardNames';

@Injectable()
export class JwtAuthGuardAdmin extends AuthGuard(GuardsNames.JWT_ADMIN) {}
