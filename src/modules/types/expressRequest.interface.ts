import { UserEntity } from "@app/modules/user/entities/user.entity"
import {Request} from 'express'

export interface ExpressRequest extends Request {
  user?: UserEntity
}