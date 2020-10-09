import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IChecklistItem, IChecklist, IMember } from 'src/app/_models';
import { SortService } from 'src/app/_services';
import { ActivatedRoute, Router } from '@angular/router';
import { MemberService } from 'src/app/_firebases/member.service';
import { DatePipe } from '@angular/common';
import { ChecklistService } from 'src/app/_firebases/checklist.service';

@Component({
  selector: 'app-create-checklist',
  templateUrl: './create-checklist.component.html',
  styleUrls: ['./create-checklist.component.css']
})
export class CreateChecklistComponent implements OnInit {
  checklist: IChecklist;
  checklistItemList: Array<IChecklistItem> = [];
  memberList: Array<IMember> = [];
  selectedDate: Date = new Date();

  constructor(
    private route: ActivatedRoute,
    private sortService: SortService,
    private memberService: MemberService,
    private datePipe: DatePipe,
    private checklistService: ChecklistService,
    private router: Router) {

  }

  ngOnInit() {
    this.memberService.getMembers()
      .subscribe(doc => {
        doc.map(data => {
          let memberItem: any = data.payload.doc.data();
          memberItem.id = data.payload.doc.id;
          this.memberList.push(memberItem);
          this.checklistItemList.push({
            id: memberItem.id,
            name: memberItem.lastName + ' ' + memberItem.firstName,
            image:memberItem.image,
            status: 0,
            selected: false,
          })
        });
        this.memberList.sort(this.sortService.sortByFirstName);
        this.checklistItemList.sort(this.sortService.sortByFirstName);
      });

    // this.route.data.subscribe(data => {
    //   console.log(data);
    //   console.log(data['checklist']);
    // });
  }

  onCheck(checklistItem) {
    checklistItem.selected = !checklistItem.selected;
  }

  getUncheckedItems() {
    return this.checklistItemList.filter(x => !x.selected);
  }

  getCheckedItems() {
    return this.checklistItemList.filter(x => x.selected);
  }

  onSubmit() {
    const checkedItems = this.getCheckedItems().map(x => x.id);
    this.checklist = {
      id: null,
      date: this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd'),
      members: this.memberList.filter(x => checkedItems.includes(x.id))
    };

    this.checklistService.getChecklistByDate(this.checklist.date)
      .get()
      .then(querySnapshot => {
        if (querySnapshot.size > 0) {
          // Merge new members with old one
          let existedChecklist = querySnapshot.docs[0].data();
          let memberIdList = this.checklist.members.map(x => x.id);
          let filteredMembers = existedChecklist.members.filter(m => memberIdList.indexOf(m.id) < 0);
          this.checklist.members = this.checklist.members.concat(filteredMembers);
          this.checklist.id = querySnapshot.docs[0].id;
          console.log(this.checklist, "jjj");

          this.checklistService.updateChecklist(this.checklist)

            .then(data => {
              this.router.navigate(['/checklists']);
            })
            .catch(error => {
              console.log('1', error);
            });
        } else {
          this.checklistService.createChecklist(this.checklist)
            .then(data => {
              this.router.navigate(['/checklists']);
            })
            .catch(error => {
              console.log('2', error);
            });
        }
      })
      .catch(error => {
        console.log(error);

      });
  }

  onCancel() {
    this.router.navigate(['/checklists']);
  }
}
