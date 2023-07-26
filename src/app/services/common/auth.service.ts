import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserService } from './user.service';
import { User_Response } from 'src/app/contracts/users/user_response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private jwtHelper: JwtHelperService, private userService: UserService) { }
  currentUser: User_Response;

  identityCheck() {
    const token: string = localStorage.getItem("accessToken");
    let expired: boolean;
    

    try {
      expired = this.jwtHelper.isTokenExpired(token);
    } catch {
      expired = true;
    }

    _isAuthenticated = token != null && !expired;
  }

    get isAuthenticated(): boolean {
      
      return _isAuthenticated;
    }

    
   async adminCheck(){
      const token2: string = localStorage.getItem("refreshToken");
    this.currentUser = await this.userService.getUserByToken(token2);
      
      
      let isNotAdmin: boolean;

      try {
        isNotAdmin = this.currentUser.role == "Member";
      } catch  {
        isNotAdmin = true;
      }

      _isAdmin = !isNotAdmin;
      
    }

    get isAdmin(): boolean {
      return _isAdmin;
      
    }
    


}

export let _isAuthenticated: boolean;
export let _isAdmin: boolean;