import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable, of, shareReplay, Subject, takeUntil} from "rxjs";
import {IUsersData} from "../models/users-data";
import {IUserInfo} from "../models/user-info";

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy {

  private _users$ !: Observable<IUserInfo[]>
  private _unsubscribe$: Subject<void> = new Subject();

  constructor(private _httpClient: HttpClient) {
    this.initUsers();
  }

  private initUsers(): void {
    this._users$ = this._httpClient.get<IUsersData>("http://cars.cprogroup.ru/api/rubetek/angular-testcase-list/")
      .pipe(
        takeUntil(this._unsubscribe$),
        map(({users, data}: IUsersData) => {
          return data.map(userData => {
            const userPersonalData = users.find(user => user.id === userData.user_id);
            userData.name = userPersonalData?.name;
            userData.email = userPersonalData?.email;
            userData.create_at = userPersonalData?.create_at;
            userData.update_at = userPersonalData?.update_at;
            userData.phone = userPersonalData?.phone;
            return userData;
          })
        }),
        shareReplay({bufferSize: 1, refCount: true})
      )
  }

  public saveDataToLS(usersInfo: IUserInfo[]) {
    localStorage.setItem('usersInfo', JSON.stringify(usersInfo));
  }

  public getUsers(): Observable<IUserInfo[]> {
    if (this._getDataFromLS().length > 0) {
      return of(this._getDataFromLS());
    }
    return this._users$;
  }

  private _getDataFromLS(): IUserInfo[] {
    return JSON.parse(localStorage.getItem('usersInfo') || "");
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

}
