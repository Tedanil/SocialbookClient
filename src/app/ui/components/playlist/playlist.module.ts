import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaylistComponent } from './playlist.component';
import { RouterModule } from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';







@NgModule({
  declarations: [
    PlaylistComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: "", component: PlaylistComponent}
    ]),
    MatFormFieldModule, MatSidenavModule, MatInputModule, MatSelectModule, MatButtonModule
  ]
})
export class PlaylistModule { }
