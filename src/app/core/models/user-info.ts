import {IUser} from "./user";

export interface IUserInfo {
  user_id: number,
  is_admin: boolean,
  is_ecp: boolean,
  status: string,
  user?: IUser
}
