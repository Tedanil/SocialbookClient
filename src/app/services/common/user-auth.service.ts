import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  constructor(private httpClientService: HttpClientService) { }

  async login(userNameOrEmail: string, password: string, callBackFunction?: () => void): Promise<void> {
    const observable: Observable<any> = this.httpClientService.post({
      controller: "auth",
      action: "login"
    }, { userNameOrEmail, password })

    await firstValueFrom(observable);
    callBackFunction();
  }
}
