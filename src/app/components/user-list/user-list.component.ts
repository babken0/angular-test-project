import {AfterViewInit, Component, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild} from '@angular/core';
import {UserService} from "../../core/services/user.service";
import {catchError, of, startWith, Subject, switchMap, takeUntil} from "rxjs";
import {SelectionModel} from '@angular/cdk/collections';
import {map} from 'rxjs/operators';
import {merge} from 'rxjs/internal/observable/merge';
import {IUserInfo} from "../../core/models/user-info";
import {CustomPaginatorIntl} from "../../core/services/custom-paginator-intl.service";
import {FilterModel} from "../../core/models/filter.model";

import {MatPaginator, MatPaginatorIntl, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  providers: [{provide: MatPaginatorIntl, useClass: CustomPaginatorIntl}],
})
export class UserListComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() filterData!: FilterModel;

  public users: IUserInfo[] = [];
  public displayedColumns = ["action", 'name', 'email', 'phone', 'is_admin', 'update_at', 'create_at', 'status', 'is_ecp'];
  public dataSource = new MatTableDataSource<any>();

  public selection = new SelectionModel<IUserInfo>(true, []);
  public resultsLength = 0;
  public numSelected = 0;

  public isLoadingResults = true;
  public isRateLimitReached = false;
  @ViewChild(MatPaginator) public paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  private _unsubscribe$: Subject<void> = new Subject();


  constructor(private _userService: UserService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this._getUsersDataWithFilter();

  }

  public syncPrimaryPaginator(event: PageEvent) {
    this.paginator.pageIndex = event.pageIndex;
    this.paginator.pageSize = event.pageSize;
    this.paginator.page.emit(event);
  }

  ngAfterViewInit() {
    this._getUsersDataWithFilter();
  }

  public isAllSelected() {
    this.numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return this.numSelected === numRows;
  }

  public masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row as IUserInfo));
    this.numSelected = this.selection.selected.length;

  }

  public lockUsers() {
    if (this.numSelected) {
      this.dataSource.data.forEach(user => {
        if (this.selection.selected.includes(user)) {
          user.status = 'BANNED'
        }
      });
      this._userService.saveDataToLS(this.users);
      this.selection.clear()
    }
  }

  public unlockUsers() {
    if (this.numSelected) {
      this.dataSource.data.forEach(user => {
        if (this.selection.selected.includes(user)) {
          user.status = 'ACTIVE'
        }
      });
      this._userService.saveDataToLS(this.users);
      this.selection.clear()
    }
  }

  public sortByColumn(columnName: string) {
    if (this.dataSource && this.dataSource.sort) {
      this.dataSource.sort.active = columnName;
      this._getUsersDataWithFilter()
    }
  }

  private _getUsersDataWithFilter() {
    this.sort?.sortChange.pipe(takeUntil(this._unsubscribe$))
      .subscribe(() => this.paginator.pageIndex = 0);

    if (this.sort && this.paginator) {

      merge(this.sort?.sortChange, this.paginator?.page)
        .pipe(
          takeUntil(this._unsubscribe$),
          startWith({}),
          switchMap(() => {
            this.isLoadingResults = true;
            return this._userService!.getUsers();
          }),
          map((users: IUserInfo[]) => {
            // Flip flag to show that loading has finished.
            this.isLoadingResults = false;
            this.isRateLimitReached = false;

            return users.filter(user => this._isMatchesTheFilter(user));
          }),
          catchError((err) => {
            this.isLoadingResults = false;
            this.isRateLimitReached = true;
            console.log(err)
            return of([]);
          })
        ).subscribe((users: IUserInfo[]) => {
        this.dataSource.data = users;
        this.users = users;
        this.sortData();

        this.resultsLength = users.length;

      });
      this.dataSource!.paginator = this.paginator;
      this.dataSource!.sort = this.sort;
    }
  }

  private sortData(): void {
    let sortBy = this.sort?.active
    let sortType = this.sort?.direction == "asc" ? 1 : -1 || 0;
    switch (sortBy) {
      case "name":
        this.users = this.users?.sort((a, b) => {
          return (a?.name?.localeCompare(b?.name || "") || 0) * sortType;
        });
        break;
      case "email":
        this.users = this.users?.sort((a, b) => {
          return (a?.email?.localeCompare(b?.email || "") || 0) * sortType;
        });
        break;
      case "status":
        this.users = this.users?.sort((a, b) => {
          return (a?.status?.localeCompare(b?.status || "") || 0) * sortType;
        });
        break;
      case "update_at":
        this.users = this.users
          ?.sort((a, b) => (a.update_at || -1 - (b.update_at || -1)) * sortType);
        break;
      case "create_at":
        this.users = this.users
          ?.sort((a, b) => (a.create_at || -1 - (b.create_at || -1)) * sortType);
        break;
      case "is_ecp":
        this.users = this.users
          ?.sort((a, b) => ((a.is_ecp ? 1 : 0) - (b.is_ecp ? 1 : 0)) * sortType);
        break;
      case "is_admin":
        this.users = this.users
          ?.sort((a, b) => ((a.is_admin ? 1 : 0) - (b.is_admin ? 1 : 0)) * sortType);
        break;
      case "phone":
        this.users = this.users
          ?.sort((a, b) => ((a.phone || 0) - (b.phone || 0)) * sortType);
        break;
    }
  }

  private _isMatchesTheFilter(userInfo: IUserInfo): boolean {
    if (this.filterData) {
      if (this.filterData.name && !userInfo?.name?.toLowerCase().includes(this.filterData.name.toLowerCase())) {
        return false
      }
      if (this.filterData.phone && !userInfo?.phone?.toString().toLowerCase().includes(this.filterData.phone.toString().toLowerCase())) {
        return false
      }
      if (this.filterData.create_at && !(userInfo.create_at && new Date(new Date(userInfo.create_at).toJSON().slice(0, 10)).getTime() == this.filterData.create_at)) {
        return false
      }
      if (this.filterData.update_at && !(userInfo.update_at && new Date(new Date(userInfo.update_at).toJSON().slice(0, 10)).getTime() == this.filterData.update_at)) {
        return false
      }
      if (this.filterData.email && !userInfo.email?.toLowerCase().includes(this.filterData.email.toLowerCase())) {
        return false
      }
      if (this.filterData.status && !userInfo?.status?.toLowerCase().includes(this.filterData.status.toLowerCase())) {
        return false
      }
      return this.filterData.is_admin == undefined || userInfo.is_admin == this.filterData.is_admin;
    }
    return true;
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}



