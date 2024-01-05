import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GuardsNames } from 'src/constants/authGuardNames';

@Injectable()
export class JwtAuthGuardSalon extends AuthGuard(GuardsNames.JWR_SALON) {}