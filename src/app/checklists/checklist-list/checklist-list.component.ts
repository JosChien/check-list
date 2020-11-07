import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ChecklistService } from 'src/app/_firebases/checklist.service';
import { IChecklist, IMember } from 'src/app/_models';
import { combineLatest } from 'rxjs';
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
  checklistList: Array<IChecklist>;
  memberList: Array<IMember>;
  chooseListDay = [];
  checkedDateList = [];
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
    const getChecklists = this.checklistService.getChecklists();
    const getMembers = this.memberService.getMembers();
    // getChecklists.subscribe(doc => {
    //   let array = [];
    //   doc.map(data => {
    //     array.push(data.payload.doc.data())
    //   })
    //   console.log(array, "ssss");
    // })

    combineLatest<any>(
      getChecklists,
      getMembers
    )
      .subscribe(data => {
        // Get checklists data
        if (data[0] !== null) {
          this.checklistList = [];
          data[0].map(docChangeAction => {
            let checklistItem: any = docChangeAction.payload.doc.data();
            checklistItem.id = docChangeAction.payload.doc.id;
            this.checklistList.push(checklistItem);
          });
          this.checklistList.sort(this.sortService.sortByDate);
          this.checkedDateList = this.checklistList.map(x => {
            return {
              idDate: x.id,
              checked: false,
              date: new Date(x.date)
            }
          })
        }

        // Get members data
        if (data[1] !== null) {
          this.memberList = [];
          data[1].map(docChangeAction => {
            let memberItem: any = docChangeAction.payload.doc.data();
            memberItem.id = docChangeAction.payload.doc.id;
            memberItem['checkedDate'] = [];
            let checklists = this.checklistList.filter(x => x.members.some(m => m.id === memberItem.id));
            checklists.map(x => {
              memberItem['checkedDate'].push(x.date);
            });
            this.memberList.push(memberItem);
          });
          this.memberList.sort(this.sortService.sortByFirstName);
        }
        this.progress = false;
      },
        (err: Response) => {
          // Log error
          console.log(err, "err");
          // const body = err.json();
          // // Display message
          // this.alertService.addAlert({ Type: 'danger', Dismissible: true, Message: 'An error occurred loading npi project setup data.' } as IAlert);
        },
        () => { console.log('completed'); });

        this.hasShortName();
  }

  hasPermission() {
    const { currentUserValue } = this.authenticationService;
    if (currentUserValue && currentUserValue.permission !== Site.CUSTOMER) {
      return true;
    }
    return false;
  }

  hasShortName() {
    const { shortName } = this.authenticationService;
    if ( shortName ) {
      this.isShortName = true;
      return;
    }
    this.isShortName = false;
  }

  hasNickName(member) {
    if (member && member.nickName) {
      return member.nickName;
    }
    return member.firstName;
  }

  createNewChecklist() {
    console.log('createNewChecklist');
    this.router.navigate(['/checklists/' + environment.NewEntityURLParameters.NewChecklist + '/create']);
  }

  isCheckedDate(checkedDate: Array<string>, date: Date): boolean {
    return checkedDate.includes(this.dateService.formatDate(date));
  }

  onClick(event) {
    event.preventDefault();
  }

  DeleteDate(){
    const { chooseListDay, checklistList } = this;
    const self = this;
    checklistList.forEach(itemCheckList => {
      if (chooseListDay.includes(itemCheckList.date)) {
        this.checklistService.deleteChecklist(itemCheckList.id);
      }
    })
    this.chooseListDay = [];
  }

  chooseDateDel(itemDay) {
    const preventEvent = this.hasPermission();
    if( preventEvent ) {
      const day = this.datePipe.transform(itemDay.date, 'yyyy-MM-dd');
      const { checkedDateList } = this;
      checkedDateList.forEach(el => {
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

  /// edit stick
  changeStick(member, checkDate) {
    const preventEvent = this.hasPermission();
    if(preventEvent) {
      const { checklistList, datePipe } = this;
      let currentDay = datePipe.transform(new Date(), 'yyyy-MM-dd')
      let checkDay = datePipe.transform(checkDate.date, 'yyyy-MM-dd')
      if (currentDay === checkDay ) {
        let setMember = {
          id: member.id,
          firstName: member.firstName,
          lastName: member.lastName,
          prefixName: member.prefixName,
        }
        const dateIsCheck = checklistList.filter(date => date.id === checkDate.idDate);

        let listMember = dateIsCheck[0].members;
        const checkMember = listMember.filter(memberIsCheck => memberIsCheck.id === setMember.id);
        if (checkMember && checkMember.length === 0) {
          listMember.push(member);
        } else {
          listMember = listMember.filter(memberIsCheck => memberIsCheck.id !== setMember.id);
        }
        this.checklist = {
          id: checkDate.idDate,
          date: checkDay,
          members: listMember
        }
        this.checklistService.updateChecklist(this.checklist);
        return;
      }
      return;
    }
    return;
  }
}
