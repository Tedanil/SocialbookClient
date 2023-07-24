import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'src/app/services/common/custom-toastr.service';
import { UserAuthService } from 'src/app/services/common/user-auth.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent extends BaseComponent implements OnInit {

  constructor(spinner: NgxSpinnerService, private userAuthService: UserAuthService, private toastrService: CustomToastrService,
    private formBuilder: FormBuilder) {
    super(spinner)
  }

  frm: FormGroup;
  submitted: boolean = false;
  ngOnInit(): void {
    this.frm = this.formBuilder.group({
    
      email: ["", [Validators.required, Validators.maxLength(50), Validators.email ]],
    });
  }

  get component() {
    return this.frm.controls;
  }

  passwordReset(email: string) {
    this.submitted = true;
    


    if (this.frm.invalid)
    return;
    this.showSpinner(SpinnerType.SquareLoader)
    this.userAuthService.passwordReset(email, () => {
      this.hideSpinner(SpinnerType.SquareLoader)
      this.toastrService.message("Mail başarıyla gönderilmiştir.", "Gönderi Başarılı", {
        messageType: ToastrMessageType.Success,
        position: ToastrPosition.TopRight,
      })
    })
  }
}
