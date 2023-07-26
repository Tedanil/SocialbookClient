import { HttpErrorResponse } from '@angular/common/http';
import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent, DeleteState } from 'src/app/dialogs/delete-dialog/delete-dialog.component';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'src/app/services/common/custom-toastr.service';
import { DialogService } from 'src/app/services/common/dialog.service';
import { HttpClientService } from 'src/app/services/common/http-client.service';
declare var $: any;

@Directive({
  selector: '[appDelete]'
})
export class DeleteDirective {

  constructor(
    private element: ElementRef,
    private _renderer: Renderer2,
    private httpclientService: HttpClientService,
    public dialog: MatDialog,
    private toastrService: CustomToastrService,
    private dialogService: DialogService,
  ) {
    const img = _renderer.createElement("img");
    img.setAttribute("src", "../../../../../assets/delete.gif");
    img.setAttribute("style", "cursor: pointer;" );
    img.width = 25;
    img.height = 25;
    _renderer.appendChild(element.nativeElement, img);
   }

   @Input() id: string;
   @Input() controller: string;
   @Output() callBack :EventEmitter<any> = new EventEmitter();
  
  
   @HostListener("click")
   async onclick() {
    this.dialogService.openDialog({
       componentType: DeleteDialogComponent,
       data: DeleteState.Yes,
       afterClosed: async () => {
        const td: HTMLTableCellElement= this.element.nativeElement;
       this.httpclientService.delete({
         controller: this.controller
   
       }, this.id).subscribe(data => {
   
         $(td.parentElement).fadeOut(1000, () => {
           this.callBack.emit();
           this.toastrService.message(`${this.controller == 'roles' ? 'Rol' : 'Şarkı'} Başarıyla Silinmiştir.`, "Başarılı", {
            messageType: ToastrMessageType.Success,
            position: ToastrPosition.TopRight
          });
          });
         }, (errorResponse: HttpErrorResponse) => {
          this.toastrService.message("Şarkı Silinemedi, Bir hata ile karşılaşıldı.", "Hata", {
            messageType: ToastrMessageType.Error,
            position: ToastrPosition.TopRight
           })
          });
        }
   
       });
   
        
   
      }
    };

  //  openDialog(afterClosed: any): void {
  //   const dialogRef = this.dialog.open(DeleteDialogComponent, {
  //     width: '250px',
  //     data: DeleteState.Yes
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result == DeleteState.Yes) {
  //       afterClosed();
  //     }
  //   });
  // }




