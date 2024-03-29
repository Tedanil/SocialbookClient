import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Observable, firstValueFrom } from 'rxjs';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from './custom-toastr.service';
import { TokenResponse } from 'src/app/contracts/token/tokenResponse';
import { AuthService } from './auth.service';
import { SocialUser } from '@abacritt/angularx-social-login';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  constructor(private httpClientService: HttpClientService,private toastrService: CustomToastrService,
    private authService: AuthService) { }

  async login(usernameOrEmail: string, password: string, callBackFunction?: () => void): Promise<any> {
    const observable: Observable<any | TokenResponse> = this.httpClientService.post<any | TokenResponse>({
      controller: "auth",
      action: "login"

    }, { usernameOrEmail, password })

    const tokenResponse: TokenResponse = await firstValueFrom(observable) as TokenResponse;
    if (tokenResponse.token) {
      localStorage.setItem("accessToken", tokenResponse.token.accessToken);
      localStorage.setItem("refreshToken", tokenResponse.token.refreshToken);
      this.authService.adminCheck();






      this.toastrService.message("Kullanıcı girişi başarılı!!", "Giriş Başarılı", {
        messageType: ToastrMessageType.Success,
        position: ToastrPosition.TopRight,
      })
    }
    if(tokenResponse.message){
      this.toastrService.message("Kullanıcı adı veya şifresi hatalı!!", "Giriş Başarısız", {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.TopRight,
      })
      
    }



    callBackFunction();
  }
  
  async refreshTokenLogin(refreshToken: string, callBackFunction?: (state) => void): Promise<any> {
    const observable: Observable<any | TokenResponse> = this.httpClientService.post({
      action: "refreshtokenlogin",
      controller: "auth"
    }, { resfreshToken: refreshToken });

    try {
      const tokenResponse: TokenResponse = await firstValueFrom(observable) as TokenResponse;
    

      if (tokenResponse) {
        localStorage.setItem("accessToken", tokenResponse.token.accessToken);
        localStorage.setItem("refreshToken", tokenResponse.token.refreshToken);
      }
    
      callBackFunction(tokenResponse ? true : false);
    } catch {
      callBackFunction(false);
    }
  } 

  async googleLogin(user: SocialUser, callBackFunction?: () => void): Promise<any> {
    const observable: Observable<SocialUser | TokenResponse> = this.httpClientService.post<SocialUser | TokenResponse>({
      action: "google-login",
      controller: "auth"
    }, user);

    const tokenResponse: TokenResponse = await firstValueFrom(observable) as TokenResponse;
    if (tokenResponse) {
      localStorage.setItem("accessToken", tokenResponse.token.accessToken);
      localStorage.setItem("refreshToken", tokenResponse.token.refreshToken);



      this.toastrService.message("Google üzerinden giriş başarılı!!", "Giriş Başarılı", {
        messageType: ToastrMessageType.Success,
        position: ToastrPosition.TopRight,
      });
    }

    callBackFunction();
  }
  async facebookLogin(user: SocialUser, callBackFunction?: () => void): Promise<any> {
    const observable: Observable<SocialUser | TokenResponse> = this.httpClientService.post<SocialUser | TokenResponse>({
      action: "facebook-login",
      controller: "auth"
    }, user);

    const tokenResponse: TokenResponse = await firstValueFrom(observable) as TokenResponse;
    if (tokenResponse) {
      localStorage.setItem("accessToken", tokenResponse.token.accessToken);
      localStorage.setItem("refreshToken", tokenResponse.token.refreshToken);



      this.toastrService.message("Facebook üzerinden giriş başarılı!!", "Giriş Başarılı", {
        messageType: ToastrMessageType.Success,
        position: ToastrPosition.TopRight,
      })

    }
    callBackFunction();
  }
  async passwordReset(email: string, callBackFunction?: () => void) {
    const observable: Observable<any> = this.httpClientService.post({
      controller: "auth",
      action: "password-reset"
    }, email);
    
    

    await firstValueFrom(observable);
    callBackFunction();
    
  }

  async verifyResetToken(resetToken: string, userId: string, callBackFunction?: () => void): Promise<boolean> {
    const observable: Observable<any> = this.httpClientService.post({
      controller: "auth",
      action: "verify-reset-token"
    }, {
      resetToken: resetToken,
      userId: userId
    });

    const state: boolean = await firstValueFrom(observable);
    callBackFunction();
    return state;
  }
}
