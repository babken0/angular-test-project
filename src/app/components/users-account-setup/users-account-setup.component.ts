import {Component, ViewChild} from '@angular/core';
import {FilterModel} from "../../core/models/filter.model";
import {UserListComponent} from "../user-list/user-list.component";

@Component({
  selector: 'app-users-account-setup',
  templateUrl: './users-account-setup.component.html',
  styleUrls: ['./users-account-setup.component.scss']
})
export class UsersAccountSetupComponent {
  @ViewChild(UserListComponent) child!: UserListComponent;
  filterData!: FilterModel;
  isOpened = false;

  public getFilterData(filter: FilterModel) {
    this.filterData = filter;
  }

  public unlock(){
    this.child.unlockUsers();
  }

  public block(){
    this.child.lockUsers()
  }
}
