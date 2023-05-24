import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { AuthService } from 'src/app/services/common/auth.service';
import { UserAuthService } from 'src/app/services/common/user-auth.service';
import { UserService } from 'src/app/services/common/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponent implements OnInit {

  constructor(private userAuthService: UserAuthService, spinner: NgxSpinnerService, 
    private authService: AuthService, private activatedRoute: ActivatedRoute,
    private router: Router, private socialAuthService: SocialAuthService) {
    super(spinner)

    socialAuthService.authState.subscribe(async (user: SocialUser) => {
      console.log(user.name)
      this.showSpinner(SpinnerType.BallScaleMultiple);
      switch (user.provider) {
        case "GOOGLE":
          await userAuthService.googleLogin(user, () => {
            this.authService.identityCheck();
            this.hideSpinner(SpinnerType.BallScaleMultiple)
            this.router.navigate([""]);

          })
          break;
        case "FACEBOOK":
          await userAuthService.facebookLogin(user, () => {
            this.authService.identityCheck();
            this.hideSpinner(SpinnerType.BallScaleMultiple)
            this.router.navigate([""]);

          })
          break;

      }
    });

  }

  ngOnInit(): void {
  }

  async login(usernameOrEmail: string, password: string) {
    this.showSpinner(SpinnerType.Pacman);
    await this.userAuthService.login(usernameOrEmail, password, () => {
      this.authService.identityCheck();
      
      this.activatedRoute.queryParams.subscribe(params => {
        const returnUrl: string = params["returnUrl"];
        if (returnUrl)
        {
          this.router.navigate([returnUrl]);
        }
        else
          this.router.navigate([""]);
      });
      this.hideSpinner(SpinnerType.Pacman)

    });

  }

  facebookLogin() {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }
  googleLogin() {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    
  }
}