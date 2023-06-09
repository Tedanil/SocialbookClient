import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './ui/components/home/home.component';
import { PlaylistComponent } from './ui/components/playlist/playlist.component';

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "playlist", loadChildren: () => import("./ui/components/playlist/playlist.module").then(module => module.PlaylistModule)},
  {path: "vote", loadChildren: () => import("./ui/components/vote/vote.module").then(module => module.VoteModule)},
  {path: "register", loadChildren: () => import("./ui/components/register/register.module").then(module => module.RegisterModule)},
  {path: "login", loadChildren: () => import("./ui/components/login/login.module").then(module => module.LoginModule)},



    

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
