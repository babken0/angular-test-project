import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserListComponent} from './user-list.component';
import {SharedModule} from "../../shared/shared.module";
import {MaterialModule} from "../../modules/material/material.module";
import {MatNativeDateModule} from "@angular/material/core";


@NgModule({
  declarations: [
    UserListComponent
  ],
  exports: [
    UserListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    MatNativeDateModule,
  ]
})
export class UserListModule {
}
