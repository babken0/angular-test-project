import {AfterViewInit, Component, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild} from '@angular/core';
import {UserService} from "../../core/services/user.service";
import {BehaviorSubject, catchError, of, startWith, Subject, switchMap, takeUntil} from "rxjs";
import {SelectionModel} from '@angular/cdk/collections';
import {map} from 'rxjs/operators';
import {merge} from 'rxjs/internal/observable/merge';
import {IUserInfo} from "../../core/models/user-info";
import {CustomPaginatorIntl} from "../../core/services/custom-paginator-intl.service";
import {FilterModel} from "../../core/models/filter.model";

import {MatPaginator, MatPaginatorIntl, PageEvent} from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  providers: [{provide: MatPaginatorIntl, useClass: CustomPaginatorIntl}],
})
export class UserListComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() filterData!: FilterModel;

  public users$?: BehaviorSubject<IUserInfo[]>;
  // public displayedColumns = ["action", 'user.name', 'user.email', 'phone', 'role', 'update_at', 'create_at', 'status', 'isEcp'];
  public displayedColumns = [  'is_admin', 'status', 'isEcp'];
  public dataSource = new MatTableDataSource<any>();

  public selection = new SelectionModel<IUserInfo>(true, []);
  public resultsLength = 0;
  public numSelected = 0;

  public isLoadingResults = true;
  public isRateLimitReached = false;
  @ViewChild(MatPaginator) public paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  private _unsubscribe$: Subject<void> = new Subject();


  constructor(private _userService: UserService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    //this._getUsersDataWithFilter();

  }

  public syncPrimaryPaginator(event: PageEvent) {
    this.paginator.pageIndex = event.pageIndex;
    this.paginator.pageSize = event.pageSize;
    this.paginator.page.emit(event);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this._userService.getUsers().subscribe(
      data =>   { this.dataSource  = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;}

  )
    this.dataSource.filter
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
      this.selection.clear()
    }
  }

  public  sortByColumn() {
    if (this.dataSource && this.dataSource.sort){
      this.dataSource.sort.active= 'phone';
    }
  }

  private _getUsersDataWithFilter() {
    // this.sort?.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    // if(this.sort && this.paginator) {
    //
    //   merge(this.sort?.sortChange, this.paginator?.page)
    //     .pipe(
    //       takeUntil(this._unsubscribe$),
    //       startWith({}),
    //       switchMap(() => {
    //         this.isLoadingResults = true;
    //         return this._userService!.getUsers();
    //       }),
    //       map((users: IUserInfo[]) => {
    //         // Flip flag to show that loading has finished.
    //         this.isLoadingResults = false;
    //         this.isRateLimitReached = false;
    //
    //         return users.filter(user => this._isMatchesTheFilter(user));
    //       }),
    //       catchError((err) => {
    //         this.isLoadingResults = false;
    //         this.isRateLimitReached = true;
    //         console.log(err)
    //         return of([]);
    //       })
    //     ).subscribe((users: IUserInfo[]) => {
    //     this.dataSource.data = users;
    //     this.resultsLength = users.length;
    //
    //     this.users$ = this.dataSource.connect();
    //   });
    //
    //   this.dataSource!.paginator = this.paginator;
    //   // this.dataSource!.sort = this.sort;
    // }
  }

  private _isMatchesTheFilter(userInfo: IUserInfo): boolean {
    if (this.filterData) {
      if (this.filterData.name && !userInfo.user?.name?.toLowerCase().includes(this.filterData.name.toLowerCase())) {
        return false
      }
      if (this.filterData.phone && !userInfo.user?.phone?.toString().toLowerCase().includes(this.filterData.phone.toString().toLowerCase())) {
        return false
      }
      if (this.filterData.create_at && !(userInfo.user && new Date(new Date(userInfo.user.create_at).toJSON().slice(0, 10)).getTime() == this.filterData.create_at)) {
        return false
      }
      if (this.filterData.update_at && !(userInfo.user && new Date(new Date(userInfo.user.update_at).toJSON().slice(0, 10)).getTime() == this.filterData.update_at)) {
        return false
      }
      if (this.filterData.email && !userInfo.user?.email?.toLowerCase().includes(this.filterData.email.toLowerCase())) {
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

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      console.log(`Sorted ${sortState.direction}ending`);
    } else {
      console.log('Sorting cleared');
    }
  }

  print(element: any) {
    console.log(element)
  }
}



