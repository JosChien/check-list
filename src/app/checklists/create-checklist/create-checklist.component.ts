import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IChecklistItem, IChecklist, IMember, IMemberSelected, IMemberAbsent } from 'src/app/_models';
import { SortService } from 'src/app/_services';
import { ActivatedRoute, Router } from '@angular/router';
import { MemberService } from 'src/app/_firebases/member.service';
import { DatePipe } from '@angular/common';
import { ChecklistService } from 'src/app/_firebases/checklist.service';
import { AlertService } from '../../_services';

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
  IdCheckList: string;
  listMember: Array<IMemberAbsent>;
  selectedDate: Date = new Date();
  listDates: Array<any>;
  listDateExit: Array<any>;


  ngOnInit() {
    const idCatechism = localStorage.getItem("idCatechism");
    const self = this;
    this.listMember = [];
    this.listDateExit = [];
    const getChecklists = this.checklistService.getChecklists();
    getChecklists.subscribe(data => {
      data.map(docChangeAction => {
        let checklistItem: any = docChangeAction.payload.doc.data();
        checklistItem.id = docChangeAction.payload.doc.id;
        if (checklistItem.class && checklistItem.class.id === idCatechism) {
          self.IdCheckList = checklistItem.id;
          if ( checklistItem.members ) {
            self.listMember = checklistItem.members;
            self.getMembers();
          }
          if (checklistItem.dates) {
            self.listDateExit = checklistItem.dates;
          }
        }
      })
    })
  }

  getMembers() {
    const { listMember } = this;
    if (listMember && listMember.length !== 0) {
      const listIdMember = listMember.map(member => member.id);
      listIdMember.map(idMember => {
        const getMember =  this.memberService.getMember(idMember);
        getMember.subscribe(doc => {
          this.memberList = [];
          let memberItem:any = doc.payload.data();
          memberItem.id = doc.payload.id;
          this.memberList.push(memberItem);
          let arrayLastname = memberItem.lastName.split(' ');
          this.checklistItemList.push({
            id: memberItem.id,
            name: arrayLastname[arrayLastname.length - 1] + ' ' + memberItem.firstName,
            avatar:memberItem.avatar,
            status: 0,
            selected: false,
          })
        })
        this.memberList.sort(this.sortService.sortByFirstName);
        this.checklistItemList.sort(this.sortService.sortByFirstName);
      })
    }

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
    let listIdMemberUnchecked = this.getUncheckedItems().map(MemberUnSelected => MemberUnSelected.id);
    let currentDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd')

    if (this.listDateExit.includes(currentDate)) {
      this.alertService.error('The selected date already exists')
      return
    };

    const { listMember } = this;
    const absentMembers = [...listMember];
    absentMembers.map(member => {
      if (listIdMemberUnchecked.includes(member.id)) {
        if (!member.absentDates) {
          member.absentDates = [];
        }
        member.absentDates.push({
          date: currentDate,
          reason: null
        })
      }
    })
    const listDateIsExit = this.listDateExit.map(date => this.datePipe.transform(date, 'yyyy-MM-dd'));
    let paramsCheckList = {
      id: this.IdCheckList,
      dates: [...listDateIsExit, currentDate],
      members: absentMembers
    };
    this.checklistService.updateChecklistItem(paramsCheckList);
    this.router.navigate(['/checklists']);
  }

  onCancel() {
    this.router.navigate(['/checklists']);
  }
}
