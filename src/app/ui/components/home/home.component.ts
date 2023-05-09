import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'src/app/services/common/custom-toastr.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private customToastr: CustomToastrService) { }

  ngOnInit(): void {
    this.customToastr.message("Hello", "BAŞ",{
      messageType: ToastrMessageType.Warning,
      position: ToastrPosition.TopCenter
    } );
  }

}
