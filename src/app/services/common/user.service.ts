import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { User } from 'src/app/entities/user';
import { Create_User } from 'src/app/contracts/users/create_user';
import { Observable, firstValueFrom } from 'rxjs';
import { User_Response } from 'src/app/contracts/users/user_response';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClientService: HttpClientService) { }

  async create(user: User): Promise<Create_User> {
    const observable: Observable<Create_User | User> = this.httpClientService.post<Create_User | User>({
      controller: "users"
    }, user);

    return await firstValueFrom(observable) as Create_User;
    
  }

  async getUserByToken(refreshToken: string): Promise<any> {
    
    const observable: Observable<any | User_Response> = this.httpClientService.post({
      controller: "users",
      action: "getuser"
    }, {refreshToken});
    const userData: User_Response = await firstValueFrom(observable);
    return userData;
  }

  async updateUserInfo(userId: string): Promise<any> {
    
    const observable: Observable<any> = this.httpClientService.post({
      controller: "users",
      action: "updateuserinfos"
    }, {userId});

    return await firstValueFrom(observable);  
  }
  async updateAllVoteCounts(): Promise<any> {
    
    const observable: Observable<any> = this.httpClientService.post({
      controller: "users",
      action: "updateallvotecounts"
    }, {});

    return await firstValueFrom(observable);  
  }

  
}
