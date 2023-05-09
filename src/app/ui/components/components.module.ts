import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaylistModule } from './playlist/playlist.module';
import { RouterModule } from '@angular/router';
import { HomeModule } from './home/home.module';
import { VoteModule } from './vote/vote.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PlaylistModule,
    HomeModule,
    VoteModule
   
  ]
})
export class ComponentsModule { }
