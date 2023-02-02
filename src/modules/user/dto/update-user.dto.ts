import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto {
  
    readonly username: string;
  
    readonly email: string;
  
    readonly password: string;

    readonly image : string;

    readonly bio : string;
  }