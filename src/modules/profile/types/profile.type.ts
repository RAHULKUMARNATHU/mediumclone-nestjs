import { UserType } from "@app/modules/user/types/user.type";

export type ProfileType = UserType & { following : boolean};
