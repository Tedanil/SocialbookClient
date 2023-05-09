import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './ui/components/home/home.component';
import { PlaylistComponent } from './ui/components/playlist/playlist.component';

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "playlist", loadChildren: () => import("./ui/components/playlist/playlist.module").then(module => module.PlaylistModule)},
    

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
