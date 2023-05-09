import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoteComponent } from './vote.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    VoteComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: "", component: VoteComponent}
    ]),
  ]
})
export class VoteModule { }
