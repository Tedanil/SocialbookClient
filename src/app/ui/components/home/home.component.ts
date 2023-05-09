import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'src/app/services/common/custom-toastr.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends BaseComponent implements OnInit {

  constructor(private customToastr: CustomToastrService, spinner: NgxSpinnerService) {
    super(spinner)
   }

  ngOnInit(): void {
    this.customToastr.message("Hello", "BAŞ",{
      messageType: ToastrMessageType.Warning,
      position: ToastrPosition.TopCenter
    } );
    //this.showSpinner(SpinnerType.BallElasticDot)
  }

}
