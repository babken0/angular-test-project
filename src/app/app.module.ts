import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {UserListModule} from "./components/user-list/user-list.module";
import {UserService} from "./core/services/user.service";
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ReactiveFormsModule} from "@angular/forms";
import {UsersAccountSetupModule} from "./components/users-account-setup/users-account-setup.module";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    UserListModule,
    HttpClientModule,
    ReactiveFormsModule,
    UsersAccountSetupModule
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
