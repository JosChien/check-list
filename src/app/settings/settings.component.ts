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
    const { currentUserValue, useShortName, language } = this.authenticationService;
    this.shortName = useShortName;
    this.language = language;
    this.userService.getUser(currentUserValue.id)
    .subscribe(doc => {
      let user: any = doc.payload.data();
      if(user.useShortName) {
        this.shortName = user.useShortName;
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
      useShortName: this.shortName,
      language: this.language
    }
    this.userService.updateUser(params).then(data => {
      this.authenticationService.useShortName = self.shortName;
      this.alertService.success('Save setting successfully!!!')
    })
  }
}
