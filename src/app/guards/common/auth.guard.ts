import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { SpinnerType } from 'src/app/base/base.component';
import { _isAdmin, _isAuthenticated } from 'src/app/services/common/auth.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'src/app/services/common/custom-toastr.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private jwtHelper: JwtHelperService, private router: Router, private toastrService: CustomToastrService,
   private spinner: NgxSpinnerService ) {
   
  }



 canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
     this.spinner.show(SpinnerType.BallSpinClockwiseFadeRotating);
     

     if(!_isAdmin) {
       this.router.navigate(["home"], {queryParams: {returnUrl: state.url } });
       this.toastrService.message("Oturum açmanız gerekiyor!", "Yetkisiz Erişim!", {
         messageType: ToastrMessageType.Warning,
         position: ToastrPosition.TopRight
       })
     }





this.spinner.hide(SpinnerType.BallSpinClockwiseFadeRotating);


   return true;
 }
 
}