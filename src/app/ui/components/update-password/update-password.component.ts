import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'src/app/services/common/custom-toastr.service';
import { UserAuthService } from 'src/app/services/common/user-auth.service';
import { UserService } from 'src/app/services/common/user.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent extends BaseComponent implements OnInit {

  constructor(spinner: NgxSpinnerService, private userAuthService: UserAuthService,
     private activatedRoute: ActivatedRoute, private toastrService: CustomToastrService,
      private userService: UserService, private router: Router) {
    super(spinner)
  }

  state: any;

  ngOnInit(): void {
    this.showSpinner(SpinnerType.SquareLoader)
    this.activatedRoute.params.subscribe({
      next: async params => {
        const userId: string = params["userId"];
        const resetToken: string = params["resetToken"];
        this.state = await this.userAuthService.verifyResetToken(resetToken, userId, () => {
          this.hideSpinner(SpinnerType.SquareLoader);
        })
      }
    });
  }

  updatePassword(password: string, passwordConfirm: string) {
    this.showSpinner(SpinnerType.SquareLoader);
    if (password != passwordConfirm) {
      this.toastrService.message("Şifreleri Doğrulayınız", "Şifre Hatalı", {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.TopRight,
      });
      this.hideSpinner(SpinnerType.SquareLoader)
      return;
    }

    this.activatedRoute.params.subscribe({
      next: async params => {
        const userId: string = params["userId"];
        const resetToken: string = params["resetToken"];
        await this.userService.updatePassword(userId, resetToken, password, passwordConfirm,
          () => {
            this.toastrService.message("Şifre başarıyla güncellenmiştir.", "Şifre Güncellendi", {
              messageType: ToastrMessageType.Success,
              position: ToastrPosition.TopRight,
            })
            this.router.navigate(["/login"])
          },
          error => {
            console.log(error)
          });
        this.hideSpinner(SpinnerType.SquareLoader)
      }
    })


  }

}
