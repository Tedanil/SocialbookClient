import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent } from 'src/app/base/base.component';
import { Create_User } from 'src/app/contracts/users/create_user';
import { User } from 'src/app/entities/user';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'src/app/services/common/custom-toastr.service';
import { UserService } from 'src/app/services/common/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends BaseComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
     private toastrService: CustomToastrService, private router: Router,
    spinner: NgxSpinnerService, private userService: UserService ) {
      super(spinner)
     }

  frm: FormGroup;
  
  ngOnInit(): void {
    this.frm = this.formBuilder.group({
      nameSurname: ["", [Validators.required, Validators.maxLength(50), Validators.minLength(3) ]],
      username: ["", [Validators.required, Validators.maxLength(50), Validators.minLength(3), Validators.pattern("^[A-Za-z]+$") ]],
      email: ["", [Validators.required, Validators.maxLength(50), Validators.email ]],
      password: ["", [Validators.required] ],
      passwordConfirm: ["", [Validators.required]]
    },
    {
      validators: (group: AbstractControl): ValidationErrors | null => {
        let password = group.get("password").value;
        let passwordConfirm = group.get("passwordConfirm").value;
        return password === passwordConfirm ? null : {notSame: true};
      }
    }
)
}

get component() {
  return this.frm.controls;
}
submitted: boolean = false;
async onSubmit(user: User)  {
  this.submitted = true;
  

 

 

  if (this.frm.invalid)
  return;

 const result: Create_User = await this.userService.create(user);
  
 if(result.succeeded)
 {
     this.toastrService.message(result.message, "Kullanıcı Kaydı Başarılı..!", {
        messageType: ToastrMessageType.Success,
        position: ToastrPosition.TopRight
        
     });
     this.router.navigate(["/login"]);
    }
     
     else
     this.toastrService.message(result.message, "Hata!", {
      messageType: ToastrMessageType.Error,
      position: ToastrPosition.TopRight
   });
   
   


}

// showPolicy(){
//   this.dialogService.openDialog({
//     componentType: PrivacyPolicyDialogComponent,
   
//     options: {
//       width: "750px",
      
      
//     }
//   });
// }

}
