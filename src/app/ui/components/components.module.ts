import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaylistModule } from './playlist/playlist.module';
import { RouterModule } from '@angular/router';
import { HomeModule } from './home/home.module';
import { VoteModule } from './vote/vote.module';
import { RegisterModule } from './register/register.module';
import { PasswordResetModule } from './password-reset/password-reset.module';
import { UpdatePasswordModule } from './update-password/update-password.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PlaylistModule,
    HomeModule,
    VoteModule,
    RegisterModule,
    PasswordResetModule,
    UpdatePasswordModule
   
  ]
})
export class ComponentsModule { }
