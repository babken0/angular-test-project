import {IUser} from "./user";
import {IUserInfo} from "./user-info";

interface IPageInfo {
  total: number,
  current: number
}

export interface IUsersData {
  page: IPageInfo,
  users: IUser[],
  data: IUserInfo[]
}
