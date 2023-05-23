import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaylistModule } from './playlist/playlist.module';
import { RouterModule } from '@angular/router';
import { HomeModule } from './home/home.module';
import { VoteModule } from './vote/vote.module';
import { RegisterModule } from './register/register.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PlaylistModule,
    HomeModule,
    VoteModule,
    RegisterModule
   
  ]
})
export class ComponentsModule { }
