import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordResetComponent } from './password-reset.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    PasswordResetComponent
  ],
  imports: [
    CommonModule, RouterModule.forChild([
      { path: "", component: PasswordResetComponent }
    ]), ReactiveFormsModule, MatButtonModule
  ]
})
export class PasswordResetModule { }
