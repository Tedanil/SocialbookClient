import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongsComponent } from './songs.component';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { DeleteDirectiveModule } from 'src/app/directives/common/delete.directive.module';





@NgModule({
  declarations: [
    SongsComponent,
    ListComponent,
    CreateComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: "", component:SongsComponent}
    ]),
    MatSidenavModule, MatFormFieldModule, MatInputModule, MatButtonModule,
    MatTableModule, MatPaginatorModule, DeleteDirectiveModule
     // FileUploadModule, DialogModule,
      
  ]
})
export class SongsModule { }
