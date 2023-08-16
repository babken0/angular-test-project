import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersAccountSetupComponent } from './users-account-setup.component';
import {UserListModule} from "../user-list/user-list.module";
import {UserFilterComponent} from "../user-filter/user-filter.component";
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {NgxMaskModule} from "ngx-mask";



@NgModule({
  declarations: [
    UsersAccountSetupComponent,
    UserFilterComponent
  ],
  exports: [
    UsersAccountSetupComponent
  ],
  imports: [
    CommonModule,
    UserListModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    NgxMaskModule.forRoot(),
  ],
  providers:[ ]
})
export class UsersAccountSetupModule { }
