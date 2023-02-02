import { UserEntity } from "../entities/user.entity";
import { UserType } from "./user.type";

export interface UserResponseInterface{
    user:UserType&{token:string}
}