import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable, shareReplay} from "rxjs";
import {IUsersData} from "../models/users-data";
import {IUserInfo} from "../models/user-info";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _users$ !: Observable<IUserInfo[]>

  constructor(private _httpClient: HttpClient) {
    this.initUsers();
  }

  private initUsers() {
    this._users$ = this._httpClient.get<IUsersData>("http://cars.cprogroup.ru/api/rubetek/angular-testcase-list/")
      .pipe(
        map(({users, data}: IUsersData) => {
          return data.map(userData => {
            userData.user = users.find(user => user.id === userData.user_id);
            return userData;
          })
        }),
        shareReplay({bufferSize: 1, refCount: true})
      )
  }


  public getUsers(): Observable<IUserInfo[]> {
    return this._users$;

  }


}
