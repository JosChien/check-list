import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClassService } from 'src/app/_firebases/class.service';
import { ChecklistService } from 'src/app/_firebases/checklist.service'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IChecklist } from 'src/app/_models';

@Component({
  selector: 'app-DialogUpdateClasses',
  templateUrl: './DialogUpdateClasses.component.html',
  styleUrls: ['./DialogUpdateClasses.component.css']
})
export class DialogUpdateClassesComponent implements OnInit {
  formUpdateUser: FormGroup;
  name: '';
  shortName: '';
  course: '';
  role: '';
  type: boolean;
  create = false;
  private listCheckList: Array<IChecklist>;

  constructor(
    private formBuilder: FormBuilder,
    private classService: ClassService,
    private checklistService: ChecklistService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    const getChecklists = this.checklistService.getChecklists();
    getChecklists.subscribe(data => {
      this.listCheckList = [];
      data.map(docChangeAction => {
        let checklistItem: any = docChangeAction.payload.doc.data();
        checklistItem.id = docChangeAction.payload.doc.id;
        this.listCheckList.push(checklistItem);
      })
    })
    this.formUpdateUser = this.formBuilder.group({
      name: ['', Validators.required],
      shortName: ['', Validators.required],
      course: ''
    });
    const { data } = this;
      if (data.create) {
        this.create = true;
        this.type = data.type;
        return;
      }
      this.type = data.type;
      this.name = data.name;
      this.shortName = data.shortName;
      this.role = data.role
  }

  onSubmit() {
    const self = this;
    if (this.create) {
      let createClass = {
        id: null,
        name: this.name,
        shortName: this.shortName
      }
      this.classService.createClass(createClass)
      .then(data => {
        let createClassCheckList = {
          id: null,
          course: self.course,
          dates: null,
          class: { id : data.id },
          members: null
        }
        self.checklistService.createChecklist(createClassCheckList)
        .then(data => {
          console.log("Tạo lớp thành công");
        })
      })
    } else {
      let updateClass = {
        id: this.data.id,
        name: this.name,
        shortName: this.shortName
      }
      this.classService.updateClass(updateClass);
    }
  }

  deleteClass() {
    const self = this;
    const { listCheckList } = this;
    listCheckList.map(itemCheckList => {
      if(itemCheckList.class.id === self.data.id) {
        self.checklistService.deleteChecklist(itemCheckList.id)
        .then( data => {
          this.classService.deleteClass(self.data.id);
        })
      }
    })
  }
}
