import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { UserService } from 'src/app/_firebases/user.service';
import { IUser } from 'src/app/_models';
import { MatDialog } from '@angular/material/dialog';
import { FormUpdateUserComponent } from '../_components/DialogUpdateUser/dialog-update-user.component'
import { Site } from 'src/app/_until/constant'
import { AuthenticationService, AlertService } from 'src/app/_services';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  listUsers: Array<IUser>;
  displayedColumns: string[] = ['firstName', 'lastName', 'class', 'role', 'action'];
  dataSource: any;

  constructor(
    private userService: UserService,
    public dialog: MatDialog,
    public authenticationService: AuthenticationService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    const preventEvent = this.hasPermisson();
    if ( preventEvent ) {
      this.userService.getUsers()
      .subscribe(doc => {
        this.listUsers = []
        doc.map(data => {
          let user: any = data.payload.doc.data();
          user.id = data.payload.doc.id;
          this.listUsers.push(user);
        })
      })
      this.dataSource = new MatTableDataSource(this.listUsers);
    } else {
      this.alertService.error('Bạn không được phép truy cập vào trang này!!!');
    }
  }

  hasPermisson() {
    const { currentUserValue } = this.authenticationService;
    if (currentUserValue && currentUserValue.role === Site.ADMIN) {
      return true;
    }
    return false;
  }

  deleteUser(user) {
    this.dialog.open(FormUpdateUserComponent, {
      data: {...user, type: false}
    });
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource);

  }

  openDialogEditUser(user) {
    const dialogRef = this.dialog.open(FormUpdateUserComponent, {
      data: {...user, type: true}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
