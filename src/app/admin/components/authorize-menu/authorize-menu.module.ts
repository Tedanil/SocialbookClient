import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorizeMenuComponent } from './authorize-menu.component';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import {MatTreeModule} from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';



@NgModule({
  declarations: [
    AuthorizeMenuComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: "", component:AuthorizeMenuComponent}
    ]),
    MatTreeModule,
    MatIconModule,
    MatButtonModule
   
    
    
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AuthorizeMenuModule { }
