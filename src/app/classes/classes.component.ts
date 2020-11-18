import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { ClassService } from 'src/app/_firebases/class.service';
import { IClass } from 'src/app/_models';
import { MatDialog } from '@angular/material/dialog';
import { DialogUpdateClassesComponent } from '../_components/DialogUpdateClasses/DialogUpdateClasses.component';
import { Site } from 'src/app/_until/constant';
import { AlertService, AuthenticationService } from 'src/app/_services';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.css']
})
export class ClassesComponent implements OnInit {
  listClasses: Array<IClass>;
  displayedColumns: string[] = ['name', 'shortName', 'action'];
  dataSource: any;
  constructor(
    private classService: ClassService,
    public dialog: MatDialog,
    public authenticationService: AuthenticationService,
    private alertService: AlertService) { }

  ngOnInit() {
    const preventEvent = this.hasPermission();
    if ( preventEvent ) {
      this.classService.getClasses()
      .subscribe(doc => {
        this.listClasses = []
        doc.map(data => {
          let classItem: any = data.payload.doc.data();
          classItem.id = data.payload.doc.id;
          this.listClasses.push(classItem);
        })
      })
      this.dataSource = new MatTableDataSource(this.listClasses);
    } else {
      this.alertService.error('Bạn không có quyền truy cập vào page này!!!')
    }
  }

  hasPermission() {
    const { currentUserValue } = this.authenticationService;
    if (currentUserValue && currentUserValue.role === Site.ADMIN) {
      return true;
    }
    return false;
  }

  deleteUser(classItem) {
    this.dialog.open(DialogUpdateClassesComponent, {
      data: {...classItem, type: false}
    });
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource);

  }

  openDialogEditUser(classItem) {
    const dialogRef = this.dialog.open(DialogUpdateClassesComponent, {
      data: {...classItem, type: true}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  createClass() {
    const dialogRef = this.dialog.open(DialogUpdateClassesComponent, {
      data: {create: true, type: true}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
