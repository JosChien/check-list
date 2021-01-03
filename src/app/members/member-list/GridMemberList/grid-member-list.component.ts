import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IMember } from 'src/app/_models';
import { Site } from 'src/app/_until/constant'
import { AuthenticationService } from 'src/app/_services';

@Component({
  selector: 'app-grid-member-list',
  templateUrl: './grid-member-list.html',
  styleUrls: ['./grid-member-list.component.css']
})
export class GridMemberListComponent implements OnInit {

  @Input() memberList: Array<IMember>;
  @Input() search: boolean;
  @Output() editItem = new EventEmitter();
  @Output() deleteItem = new EventEmitter();
  constructor( public authenticationService: AuthenticationService ) { }

  ngOnInit() {}

  hasPermission() {
    const { currentUserValue } = this.authenticationService;
    if (currentUserValue) {
      return true;
    }
    return false;
  }

  editMember(event, item) {
    event.stopPropagation();
    this.editItem.emit(item);
  }

  deleteMember(event, item) {
    event.stopPropagation();
    this.deleteItem.emit(item.id);
  }

  change(event, index) {
    event.stopPropagation();
    var element = document.getElementsByClassName("cards");
    element[index].classList.toggle("applyflip");
  }
}
