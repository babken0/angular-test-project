import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FilterModel} from "../../core/models/filter.model";

@Component({
  selector: 'app-user-filter',
  templateUrl: './user-filter.component.html',
  styleUrls: ['./user-filter.component.scss']
})
export class UserFilterComponent {
  @Output() filter = new EventEmitter<FilterModel>()
  public static readonly U_NAME_PATTERN = "^[A-Za-z0-9_-]*$";
  public static readonly U_EMAIL_PATTERN = "^[\.@A-Za-z0-9_-]*$";
  public filterForm =this.fb.group({
    login: ['', [
      Validators.minLength(2),
      Validators.pattern(UserFilterComponent.U_NAME_PATTERN)
    ]],
    phone: [''],
    create_at: [''],
    status: [''],
    email: ['', [
      Validators.minLength(4),
      Validators.pattern(UserFilterComponent.U_EMAIL_PATTERN)
    ]],
    is_admin: [''],
    update_at: [''],
  });


  constructor(private fb: FormBuilder) {
  }

  public onSubmit() {
    this.filter.emit(this.createFilterModel());
  }

  public cancel() {
    this.filter.emit(this.createFilterModel());
  }

  public reset() {
    this.filterForm.reset();
  }

  private createFilterModel(): FilterModel {
    return {
      name: this.filterForm.controls["login"].value || undefined,
      email: this.filterForm.controls["email"].value || undefined,
      phone: Number.parseInt(this.filterForm.controls["phone"].value || "") || undefined,
      create_at: new Date(this.filterForm.controls["create_at"].value || "").valueOf() || undefined,
      update_at: new Date(this.filterForm.controls["update_at"].value || "").valueOf() || undefined,
      is_admin: this.filterForm.controls["is_admin"].value ? !!+this.filterForm.controls["is_admin"].value : undefined,
      status: this.filterForm.controls["status"].value || undefined,
    }
  }

  get login() {
    return this.filterForm.get('login')!;
  }

  get email() {
    return this.filterForm.get('email')!;
  }
}
