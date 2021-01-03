import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-DialogHandleReason',
  templateUrl: './DialogHandleReason.component.html',
  styleUrls: ['./DialogHandleReason.component.css']
})
export class DialogHandleReasonComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<DialogHandleReasonComponent>,
  @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
