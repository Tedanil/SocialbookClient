import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { List_Role } from 'src/app/contracts/role/list_role';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'src/app/services/common/custom-toastr.service';
import { DialogService } from 'src/app/services/common/dialog.service';
import { RoleService } from 'src/app/services/common/role.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends BaseComponent implements OnInit {

  constructor(spinner:NgxSpinnerService,
    private roleService: RoleService,
    private toastrService: CustomToastrService,
    private dialogService: DialogService) {
    super(spinner)
  }
 

 displayedColumns: string[] = ['name', 'edit' ];
 dataSource: MatTableDataSource<List_Role> = null;


 @ViewChild(MatPaginator) paginator: MatPaginator;
  async getRoles() {

   this.showSpinner(SpinnerType.SquareJellyBox);
   const allRoles: {datas: List_Role[], totalRoleCount: number} =  await this.roleService
   .getRoles(this.paginator ? this.paginator.pageIndex : 0, this.paginator ? this.paginator.pageSize : 5,
      () => this.hideSpinner(SpinnerType.SquareJellyBox), errorMessage => this.toastrService.message(errorMessage, "hata", {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.TopRight
      }))
    this.dataSource = new MatTableDataSource<List_Role>(allRoles.datas);
    
    this.paginator.length = allRoles.totalRoleCount;
    
    
  }

 async ngOnInit() {

   await this.getRoles();

   
 }


 async handlePageEvent() {
   
   await  this.getRoles();
   
 }
   

}
