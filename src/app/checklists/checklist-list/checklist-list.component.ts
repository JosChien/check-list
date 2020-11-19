import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ChecklistService } from 'src/app/_firebases/checklist.service';
import { IChecklist, IMember, IMemberAbsent } from 'src/app/_models';
import { MemberService } from 'src/app/_firebases/member.service';
import { SortService, DateService } from 'src/app/_services';
import { DatePipe } from '@angular/common';
import { Site } from 'src/app/_until/constant'
import { AuthenticationService } from 'src/app/_services';

@Component({
  selector: 'app-checklist-list',
  templateUrl: './checklist-list.component.html',
  styleUrls: ['./checklist-list.component.css']
})
export class ChecklistListComponent implements OnInit {
  checklist: IChecklist;
  memberList: Array<IMember>;
  IdCheckList: string;
  listMember: Array<IMemberAbsent>;
  listDateExit: Array<string>;
  chooseListDay = [];
  listDatesCheckList = [];
  progress = true;
  isShortName = false;

  constructor(
    private router: Router,
    private checklistService: ChecklistService,
    private memberService: MemberService,
    private sortService: SortService,
    private datePipe: DatePipe,
    private dateService: DateService,
    public authenticationService: AuthenticationService) { }

  ngOnInit() {
    const idCatechism = localStorage.getItem("idCatechism");
    if (!idCatechism) {
      this.router.navigate(['/']);
      return
    }
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
            this.handlelistDatesCheckList();
          }
        }
      })
    })
    this.progress = false;
  }

  handlelistDatesCheckList() {
    const { listDateExit } = this;
    if ( listDateExit ) {
      this.listDatesCheckList = listDateExit.map(x => {
        return {
          checked: false,
          date: new Date(x)
        }
      })
      this.listDatesCheckList.sort(this.sortService.sortByDate);
    }
  }

  getMembers() {
    const { listMember } = this;
    this.memberList = [];
    if (listMember && listMember.length !== 0) {
      const listIdMember = listMember.map(member => member.id);
      listIdMember.map(idMember => {
      const getMember =  this.memberService.getMember(idMember);
        getMember.subscribe(doc => {
        let member:any = doc.payload.data();
        member.id = doc.payload.id;
        this.memberList.push(member);
        })
      })
    }
  }

  hasPermission() {
    const { currentUserValue } = this.authenticationService;
    if (currentUserValue) {
      return true;
    }
    return false;
  }

  hasShortName() {
    const { useShortName } = this.authenticationService;
    if ( useShortName ) {
      this.isShortName = true;
      return;
    }
    this.isShortName = false;
  }

  hasNickname(member) {
    if (member && member.nickname) {
      return member.nickname;
    }
    return member.firstName;
  }

  createNewChecklist() {
    this.router.navigate(['/checklists/' + environment.NewEntityURLParameters.NewChecklist + '/create']);
  }

  isCheckedDate(idMember: string, date: Date): boolean {
    const { listMember } = this;
    const checkMember = listMember.filter(member => member.id === idMember)
    let dates = [];
    if (checkMember[0].absentDates) {
      dates = checkMember[0].absentDates.map(date => date.date);
    }
    return !dates.includes(this.dateService.formatDate(date));
  }

  absentPermission(idMember: string, date: Date): boolean {
    const { listMember } = this;
    const checkMember = listMember.filter(member => member.id === idMember)
    let dates = [];
    if (checkMember[0].absentDates) {
      dates = checkMember[0].absentDates.map(ItemDate => {
        if (ItemDate.reason) {
          return ItemDate.date;
        }
        return;
      });
    }
    return dates.includes(this.dateService.formatDate(date));
  }

  onClick(event) {
    event.preventDefault();
  }

  total(memberId): number {
    const { listMember } = this;
    const { listDatesCheckList } = this;
    const listDates = listDatesCheckList.map(date => date.date);
    const checkMember = listMember.filter(member => member.id === memberId);
    if (!checkMember[0].absentDates) {
      checkMember[0].absentDates = [];
    }
    return listDates.length - checkMember[0].absentDates.length;
  }

  totalAwol(memberId): number {
    const { listMember } = this;
    const checkMember = listMember.filter(member => member.id === memberId)
    let dates = [];
    if (checkMember[0].absentDates) {
      dates = checkMember[0].absentDates.filter(ItemDate => !ItemDate.reason);
    }
    return dates.length;
  }

  DeleteDate(){
    const { chooseListDay } = this;
    const self = this;
    const { listMember, listDateExit } = this;
    const listMembers = [...listMember];
    const members = listMembers.map(member => {
      if (member.absentDates) {
        let duplicateAbsentDates = member.absentDates.filter(
          absentdate => !chooseListDay.includes(absentdate.date)
        )
        return {
          id: member.id,
          absentDates: duplicateAbsentDates
        }
      }
      return member;
    })
    const listDateIsExit = listDateExit.filter(date => !chooseListDay.includes(date));
    let paramsCheckList = {
      id: this.IdCheckList,
      dates: listDateIsExit,
      members: members
    };

    this.checklistService.updateChecklistItem(paramsCheckList)
    .then(data => {
      console.log("delete date checklist successfully");
      this.handlelistDatesCheckList();
    })
    this.chooseListDay = [];
  }

  chooseDateDel(itemDay) {
    const preventEvent = this.hasPermission();
    if( preventEvent ) {
      const day = this.datePipe.transform(itemDay.date, 'yyyy-MM-dd');
      const { listDatesCheckList } = this;
      listDatesCheckList.forEach(el => {
        if(itemDay === el) {
          return itemDay.checked = !itemDay.checked ;
        }
        return ;
      });

      if(this.chooseListDay.includes(day)) {
        return this.chooseListDay = this.chooseListDay.filter( date => date !== day);
      }
      return this.chooseListDay.push(day);
    }
    return;
  }
}
