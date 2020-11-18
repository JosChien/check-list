import { Component, OnInit } from '@angular/core';
import { ClassService } from 'src/app/_firebases/class.service';
import { IClass } from 'src/app/_models';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/_services';

@Component({
  selector: 'app-DialogChooseClass',
  templateUrl: './DialogChooseClass.component.html',
  styleUrls: ['./DialogChooseClass.component.css']
})
export class DialogChooseClassComponent implements OnInit {
  idCatechism = '';
  listCatechism: Array<IClass>;
  listClass: Array<IClass>;

  constructor(
    private classService: ClassService,
    public authenticationService: AuthenticationService,
    private dialogRef: MatDialogRef<DialogChooseClassComponent>
  ) { }

  ngOnInit() {
    const { currentUserValue } = this.authenticationService;
    const listCatechism = this.classService.getClasses();
    this.listCatechism = [];
    this.listClass = [];
    listCatechism.subscribe(doc => {
      doc.map(data => {
        let catechism: any = data.payload.doc.data();
        catechism.id = data.payload.doc.id;
        this.listCatechism.push(catechism);
      })
      if (currentUserValue && currentUserValue.classes) {
        currentUserValue.classes.map(idClass => {
          let childCatechism = this.listCatechism.filter(
            catechism => catechism.id === idClass.id);
            this.listClass.push(childCatechism[0]);
        })
      } else {
        this.listClass = this.listCatechism;
      }
    })
  }

  handleCatechism($event) {
    this.idCatechism = $event.value;
  }

  sendClass() {
    const { idCatechism } = this;
    localStorage.setItem('idCatechism', idCatechism);
    this.closeDialog();
  }

  closeDialog(){
    this.dialogRef.close();
  }
}
