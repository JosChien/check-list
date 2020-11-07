import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { UserService } from 'src/app/_firebases/user.service';
import { IUser } from 'src/app/_models/iuser';
import { MatDialog } from '@angular/material/dialog';
import { FormUpdateUserComponent } from '../_components/DialogUpdateUser/dialog-update-user.component'
import { from } from 'rxjs';
import { Site } from 'src/app/_until/constant'
import { AuthenticationService } from 'src/app/_services';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  listUsers: Array<IUser>;
  displayedColumns: string[] = ['userName', 'firstName', 'lastName', 'permission', 'action'];
  dataSource: any;

  constructor(
    private userService: UserService,
    public dialog: MatDialog,
    public authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    const preventEvent = this.hasPermission();
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
    }
  }

  hasPermission() {
    const { currentUserValue } = this.authenticationService;
    if (currentUserValue && currentUserValue.permission === Site.ADMIN) {
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
    console.log(user);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
