import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/_firebases/user.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Site } from 'src/app/_until/constant';
import { IClass } from 'src/app/_models/iclass';
import { ClassService } from 'src/app/_firebases/class.service';

@Component({
  selector: 'app-dialog-update-user',
  templateUrl: './dialog-update-user.component.html',
  styleUrls: ['./dialog-update-user.component.css']
})
export class FormUpdateUserComponent implements OnInit {
  formUpdateUser: FormGroup;
  firstName: '';
  lastName: '';
  userName: '';
  password: '';
  role: '';
  type: boolean;
  listRole = [Site.ADMIN, Site.GLV];
  listCatechism: Array<IClass>;
  listClass = [];

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private classService: ClassService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.formUpdateUser = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });

    const { data } = this;
    this.type = data.type;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.userName = data.username;
    this.password = data.password;
    this.role = data.role;
    this.listCatechism = data.classes.map(item => item.id);


    const listCatechism = this.classService.getClasses();
    this.listClass = [];
    listCatechism.subscribe(doc => {
      doc.map(data => {
        let catechism: any = data.payload.doc.data();
        catechism.id = data.payload.doc.id;
        if (this.listCatechism.includes(catechism.id)) {
          catechism.selected = true;
        } else {
          catechism.selected = false;
        }
        this.listClass.push(catechism);
      })
    })
  }

  onSubmit() {
    let catechisms = [];
    this.getCheckedItems().map(catechism => {
      let classItem = {
        id: catechism.id,
        name: catechism.name,
        shortName: catechism.shortName
      }
      catechisms.push(classItem);
    });

    let updateUser = {
      id: this.data.id,
      firstName: this.firstName,
      lastName: this.lastName,
      role: this.role,
      password: this.password,
      username: this.userName,
      classes: catechisms
    }
    this.userService.updateUser(updateUser)
  }

  changeRole($event) {
    this.role = $event.value;
  }

  deleteUser() {
    this.userService.deleteUser(this.data.id);
  }

  onCheck(checklistItem) {
    checklistItem.selected = !checklistItem.selected;
  }

  getUncheckedItems() {
    return this.listClass.filter(x => !x.selected);
  }

  getCheckedItems() {
    return this.listClass.filter(x => x.selected);
  }
}
