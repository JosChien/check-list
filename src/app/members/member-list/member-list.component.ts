import { Component, OnInit } from '@angular/core';
import { IMember } from 'src/app/_models';
import { environment } from 'src/environments/environment';
import { SortService } from 'src/app/_services';
import { Router } from '@angular/router';
import { MemberService } from 'src/app/_firebases/member.service';
import { AuthenticationService } from 'src/app/_services';
import { MatDialog } from '@angular/material/dialog';
import { DialogChooseClassComponent } from 'src/app/_components/DialogChooseClass/DialogChooseClass.component';
import { ChecklistService } from 'src/app/_firebases/checklist.service';
import { IMemberAbsent } from 'src/app/_models';
@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})

export class MemberListComponent implements OnInit {
  memberList : Array<IMember>;
  memberListAPI: Array<IMember>;
  IdCheckList: string;
  listMember: Array<IMemberAbsent>;
  listChecked = [];
  viewTable = false;
  checkSearch = false;
  search = '';
  // progress = true;

  constructor(
    private router: Router,
    private sortService: SortService,
    private memberService: MemberService,
    public authenticationService: AuthenticationService,
    public dialog: MatDialog,
    private checklistService: ChecklistService,
  ) { }

  ngOnInit() {
    const idCatechism = localStorage.getItem("idCatechism");
    if (!idCatechism) {
      this.openDialogChooseClass();
      return;
    }
    const self = this;
    this.listMember = [];
    const getChecklists = this.checklistService.getChecklists();
    getChecklists.subscribe(data => {
      data.map(docChangeAction => {
        let checklistItem: any = docChangeAction.payload.doc.data();
        checklistItem.id = docChangeAction.payload.doc.id;
        if (checklistItem.class && checklistItem.class.id === idCatechism) {
          self.IdCheckList = checklistItem.id;
          if ( checklistItem.members ) {
            self.listMember = checklistItem.members;
            this.getMembers();
          }
        }
      })
    })
    // this.progress = false;
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
        member.isChecked = false;
        this.memberList.push(member);
        })
      })
    }
    this.memberList.sort(this.sortService.sortByFirstName);
    this.memberListAPI = this.memberList;
  }

  openDialogChooseClass() {
    this.dialog.open(DialogChooseClassComponent, { disableClose: true });
  }

  hasPermission() {
    const { currentUserValue } = this.authenticationService;
    if (currentUserValue) {
      return true;
    }
    return false;
  }

  createNew() {
    this.router.navigate(['/members/form-member']);
  }

  update(item) {
    this.router.navigate(['/members/form-member', {id: item.id}]);
  }

  checkList(item) {
    const { memberList } = this;
    memberList.forEach(el => {
      if(item === el) {
        return item.isChecked = !item.isChecked ;
      }
      return ;
    });

    if(this.listChecked.includes(item.id)) {
      return this.listChecked = this.listChecked.filter( id => id !== item.id);
    }
    return this.listChecked.push(item.id)
  }

  deleteMembers() {
    this.memberList = [];
    const { listMember, IdCheckList } = this;
    let listMembers = listMember.filter(member => !this.listChecked.includes(member.id))
    let parmasCheckList = {
      id: IdCheckList,
      members: [...listMembers]
    }
    this.checklistService.updateChecklistItem(parmasCheckList)
    .then(data => {
        this.listChecked.forEach( listId => {
          debugger
          this.memberService.deleteMember(listId);
      })
    })
    this.listChecked = [];
  }

  handlerChangeView() {
    this.viewTable = !this.viewTable;
  }

  searchInput() {
    this.checkSearch = !this.checkSearch;
  }

  clearData() {
    this.search = '';
    this.filterName('');
  }

  clearAccent(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    return str;
}

  filterName(searchType) {
    const { memberListAPI } = this;
    let self = this;
    if (searchType) {
      // filter SaintName
      let filterSaintName = memberListAPI.filter(item =>
        self.clearAccent(item.saintName).toLowerCase().includes(searchType.toLowerCase())
          )
      // filter firsName
      let filterFirstName = memberListAPI.filter(item =>
          item.firstName.toLowerCase().includes(searchType.toLowerCase())
          )
      //filter LastName
      let lastName = memberListAPI.filter(item =>
        item.lastName.toLowerCase().includes(searchType.toLowerCase())
        )
      //filter date of birth
      let filterBirthday = memberListAPI.filter(item => {
        if (item.dateOfBirth) {
          item.dateOfBirth.toLowerCase().includes(searchType.toLowerCase());
        }
      })
      //filter Number phone
      let filterPhone = memberListAPI.filter(item => {
        if (item.phoneNumber) {
          item.phoneNumber.toLowerCase().includes(searchType.toLowerCase());
        }
      })
      //filter Name Dady
      let filterNameDad = memberListAPI.filter(item => {
        if (item.fullNameDad) {
          item.fullNameDad.toLowerCase().includes(searchType.toLowerCase());
        }
      })
      // filter Name Mom
      let filterNameMom = memberListAPI.filter(item => {
        if (item.fullNameMom) {
          item.fullNameMom.toLowerCase().includes(searchType.toLowerCase());
        }
      })
      //Number phone Dady
      let filterPhoneDady = memberListAPI.filter(item => {
        if (item.phoneNumberDad) {
          item.phoneNumberDad.toLowerCase().includes(searchType.toLowerCase());
        }
      })
      // Number phone Mommy
      let filterPhoneMomy = memberListAPI.filter(item => {
        if (item.phoneNumberMom) {
          item.phoneNumberMom.toLowerCase().includes(searchType.toLowerCase());
        }
      })

      let filterMember = [
        ...filterFirstName,
        ...lastName,
        ...filterBirthday,
        ...filterSaintName,
        ...filterPhone,
        ...filterNameDad,
        ...filterNameMom,
        ...filterPhoneDady,
        ...filterPhoneMomy
      ]

      let filterMemberList = [];
      filterMember.map(member => {
        if(!filterMemberList.includes(member)) {
          filterMemberList.push(member);
          return;
        }
        return;
      })
      this.memberList = filterMemberList;
      this.memberList.sort(this.sortService.sortByFirstName);
      return;
    }
    this.memberList = this.memberListAPI;
  }
}
