import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './ui/components/home/home.component';
import { PlaylistComponent } from './ui/components/playlist/playlist.component';
import { LayoutComponent } from './admin/layout/layout.component';
import { DashboardComponent } from './admin/components/dashboard/dashboard.component';
import { AuthGuard } from './guards/common/auth.guard';

const routes: Routes = [
  {
    path: "admin", component: LayoutComponent, children: [
      { path: "", component: DashboardComponent, canActivate: [AuthGuard] },
      { path: "songs", loadChildren: () => import("./admin/components/songs/songs.module").then(module => module.SongsModule), canActivate: [AuthGuard] },
      { path: "authorize-menu", loadChildren: () => import("./admin/components/authorize-menu/authorize-menu.module").then(module => module.AuthorizeMenuModule), canActivate: [AuthGuard] },
      { path: "roles", loadChildren: () => import("./admin/components/role/role.module").then(module => module.RoleModule), canActivate: [AuthGuard] },
      { path: "users", loadChildren: () => import("./admin/components/user/user.module").then(module => module.UserModule), canActivate: [AuthGuard] },
    ], canActivate: [AuthGuard] 
  },
  
  {path: "", component: HomeComponent},
  {path: "playlist", loadChildren: () => import("./ui/components/playlist/playlist.module").then(module => module.PlaylistModule)},
  {path: "vote", loadChildren: () => import("./ui/components/vote/vote.module").then(module => module.VoteModule)},
  {path: "register", loadChildren: () => import("./ui/components/register/register.module").then(module => module.RegisterModule)},
  {path: "login", loadChildren: () => import("./ui/components/login/login.module").then(module => module.LoginModule)},
  { path: "password-reset", loadChildren: () => import("./ui/components/password-reset/password-reset.module").then(module => module.PasswordResetModule) },
  { path: "update-password/:userId/:resetToken", loadChildren: () => import("./ui/components/update-password/update-password.module").then(module => module.UpdatePasswordModule) },



    

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
