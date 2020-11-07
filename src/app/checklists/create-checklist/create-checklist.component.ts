import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IChecklistItem, IChecklist, IMember, IMemberSelected } from 'src/app/_models';
import { SortService } from 'src/app/_services';
import { ActivatedRoute, Router } from '@angular/router';
import { MemberService } from 'src/app/_firebases/member.service';
import { DatePipe } from '@angular/common';
import { ChecklistService } from 'src/app/_firebases/checklist.service';
import { combineLatest } from 'rxjs';
import { AlertService } from '../../_services';
import { isNgTemplate } from '@angular/compiler';

@Component({
  selector: 'app-create-checklist',
  templateUrl: './create-checklist.component.html',
  styleUrls: ['./create-checklist.component.css']
})
export class CreateChecklistComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private sortService: SortService,
    private memberService: MemberService,
    private datePipe: DatePipe,
    private checklistService: ChecklistService,
    private alertService: AlertService,
    private router: Router) {

  }

  checklist: IChecklist;
  listMemberSelected: Array<IMemberSelected> = [];
  checklistItemList: Array<IChecklistItem> = [];
  memberList: Array<IMember> = [];
  selectedDate: Date = new Date();
  listDateExit = [];

  ngOnInit() {
    const getChecklists = this.checklistService.getChecklists();
    const getMembers = this.memberService.getMembers();

    combineLatest<any>(
      getChecklists,
      getMembers
    )
      .subscribe(data => {

          // Get checklists data
          if (data[0] !== null) {
            data[0].map(docChangeAction => {
              let checklistItem: any = docChangeAction.payload.doc.data();
              this.listDateExit.push(checklistItem.date);
            });
          }

          // Get members data
          if (data[1] !== null) {
            let memberItem: any
            data[1].map(dataMemberItem => {
              memberItem = dataMemberItem.payload.doc.data();
              memberItem.id = dataMemberItem.payload.doc.id;
              this.memberList.push(memberItem);
              let arrayLastname = memberItem.lastName.split(' ');
                this.checklistItemList.push({
                  id: memberItem.id,
                  name: arrayLastname[arrayLastname.length - 1] + ' ' + memberItem.firstName,
                  image:memberItem.image,
                  status: 0,
                  selected: false,
                })
                this.memberList.sort(this.sortService.sortByFirstName);
                this.checklistItemList.sort(this.sortService.sortByFirstName);
            })
          }
      });
    }

  FilterDate = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Selected sunday.
    return day == 0 ;
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

  SelectAll() {
    this.checklistItemList = this.checklistItemList.map(item => {
      let duplicateItem = item;
      duplicateItem.selected = true;
      return duplicateItem;
    })
  }

  onSubmit() {
    const checkedItems = this.getCheckedItems().map(x => x.id);
    this.listMemberSelected = this.memberList.map(MemberSelected => {
      let objMember = {
        id: MemberSelected.id,
        prefixName: MemberSelected.prefixName,
        firstName: MemberSelected.firstName,
        lastName: MemberSelected.lastName
      }
      return objMember
    })
    let currentDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd')
    if (this.listDateExit.includes(currentDate)) {
      this.alertService.error('The selected date already exists')
      return
    };

    this.checklist = {
      id: null,
      date: currentDate,
      members: this.listMemberSelected.filter(x => checkedItems.includes(x.id))
    };
    this.checklistService.getChecklistByDate(this.checklist.date)
      .get()
      .then(querySnapshot => {
        // if (querySnapshot.size > 0) {
        //   // Merge new members with old one
        //   let existedChecklist = querySnapshot.docs[0].data();
        //   let memberIdList = this.checklist.members.map(x => x.id);
        //   let filteredMembers = existedChecklist.members.filter(m => memberIdList.indexOf(m.id) < 0);
        //   this.checklist.members = this.checklist.members.concat(filteredMembers);
        //   this.checklist.id = querySnapshot.docs[0].id;
        //   console.log(this.checklist, "jjj");

        //   this.checklistService.updateChecklist(this.checklist)

        //     .then(data => {
        //       this.router.navigate(['/checklists']);
        //     })
        //     .catch(error => {
        //       console.log('1', error);
        //     });
        // } else {
          this.checklistService.createChecklist(this.checklist)
            .then(data => {
              this.router.navigate(['/checklists']);
            })
            .catch(error => {
              console.log('2', error);
            });
        // }
      })
      .catch(error => {
        console.log(error);

      });
  }

  onCancel() {
    this.router.navigate(['/checklists']);
  }
}
