import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services';
import { Site } from 'src/app/_until/constant'

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(
    private router: Router,
    public authenticationService: AuthenticationService) { }

  ngOnInit() {
  }

  logout() {
    console.log('logout');

    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  havePermission() {
    const { currentUserValue } = this.authenticationService;
    if (currentUserValue && currentUserValue.role === Site.ADMIN) {
      return true;
    }
    return false;
  }
}
