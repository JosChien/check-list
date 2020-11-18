import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services';
import { MatDialog } from '@angular/material/dialog';
import { DialogChooseClassComponent } from 'src/app/_components/DialogChooseClass/DialogChooseClass.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    public authenticationService: AuthenticationService,
    public dialog: MatDialog
    ) { }

  ngOnInit() {
    const idCatechism = localStorage.getItem("idCatechism");
    if (!idCatechism) {
      this.openDialogChooseClass();
    }
  }

  openDialogChooseClass() {
    this.dialog.open(DialogChooseClassComponent, { disableClose: true });
  }
}
