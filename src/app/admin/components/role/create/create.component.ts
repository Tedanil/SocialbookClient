import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'src/app/services/common/custom-toastr.service';
import { RoleService } from 'src/app/services/common/role.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent extends BaseComponent implements OnInit {

  constructor(spinner:NgxSpinnerService,  private roleService: RoleService, private toastrService: CustomToastrService) {
    super(spinner)
   }

  ngOnInit(): void {}

  @Output() createdRole: EventEmitter<string> = new EventEmitter;
  create(name:HTMLInputElement) {
    this.showSpinner(SpinnerType.SquareJellyBox);
     
   


     this.roleService.create(name.value, () => {
        this.hideSpinner(SpinnerType.SquareJellyBox);
        this.toastrService.message("Role Başariyla Eklenmiştir.", "Başarılı", {
          messageType: ToastrMessageType.Success,
          position: ToastrPosition.TopRight
        });
        this.createdRole.emit(name.value);
      }, errorMessage => {
        this.toastrService.message(errorMessage, "Hata", {
          messageType: ToastrMessageType.Error,
          position: ToastrPosition.TopRight
        });
      });

    
  }

}
