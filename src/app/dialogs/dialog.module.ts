import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatBadgeModule} from '@angular/material/badge';
import { AuthorizeMenuDialogComponent } from './authorize-menu-dialog/authorize-menu-dialog.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { AuthorizeUserDialogComponent } from './authorize-user-dialog/authorize-user-dialog.component';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';



@NgModule({
    declarations: [
   
    AuthorizeMenuDialogComponent,
         AuthorizeUserDialogComponent,
         DeleteDialogComponent
  ],
    imports: [
      CommonModule,
      MatDialogModule, MatButtonModule, MatCardModule,
      FormsModule, MatIconModule,
      MatTableModule, MatToolbarModule,MatBadgeModule,MatListModule,MatFormFieldModule, MatInputModule,MatMenuModule
    ]
  })
  export class DialogModule { }
  