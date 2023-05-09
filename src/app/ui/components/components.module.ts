import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaylistModule } from './playlist/playlist.module';
import { RouterModule } from '@angular/router';
import { HomeModule } from './home/home.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PlaylistModule,
    HomeModule
   
  ]
})
export class ComponentsModule { }
