import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorizeMenuModule } from './authorize-menu/authorize-menu.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { RoleModule } from './role/role.module';
import { SongsModule } from './songs/songs.module';
import { UserModule } from './user/user.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AuthorizeMenuModule,
    DashboardModule,
    RoleModule,
    SongsModule,
    UserModule
  ]
})
export class ComponentsModule { }
