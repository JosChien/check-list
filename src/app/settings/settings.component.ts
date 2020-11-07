import { Component, OnInit } from '@angular/core';
import { Site } from 'src/app/_until/constant'
import { AuthenticationService, AlertService } from 'src/app/_services';
import { UserService } from 'src/app/_firebases/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  shortName: boolean;
  language: boolean

  constructor(
    private userService: UserService,
    public authenticationService: AuthenticationService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    const { currentUserValue, shortName, language } = this.authenticationService;
    this.shortName = shortName;
    this.language = language;
    this.userService.getUser(currentUserValue.id)
    .subscribe(doc => {
      let user: any = doc.payload.data();
      if(user.shortName) {
        this.shortName = user.shortName;
      }
      if (user.language) {
        this.language = user.language;
      }
    })
  }

  Save() {
    const { currentUserValue } = this.authenticationService;
    const self = this;
    let params = {
      ...currentUserValue,
      shortName: this.shortName,
      language: this.language
    }
    this.userService.updateUser(params).then(data => {
      this.authenticationService.shortName = self.shortName;
      this.alertService.success('Save setting successfully!!!')
    })
  }
}
