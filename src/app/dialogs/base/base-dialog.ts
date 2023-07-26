import { MatDialogRef } from "@angular/material/dialog";

export class BaseDialog<DialogComponenet> {
    constructor(public dialogRef: MatDialogRef<DialogComponenet>) {

    }


    close() {
        this.dialogRef.close();
        
    }
}