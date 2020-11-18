import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services';
import { Site } from 'src/app/_until/constant';
import { AlertService } from 'src/app/_services';
import { UserService } from 'src/app/_firebases/user.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  avatar = '/assets/image/default-user-image.png';
  useShortName: boolean;
  language: boolean

  constructor(
    private router: Router,
    private userService: UserService,
    public authenticationService: AuthenticationService,
    private alertService: AlertService) { }

    ngOnInit() {
      const { currentUserValue, useShortName, language } = this.authenticationService;
      this.useShortName = useShortName;
      this.language = language;
      this.userService.getUser(currentUserValue.id)
      .subscribe(doc => {
        let user: any = doc.payload.data();
        if(user.useShortName) {
          this.useShortName = user.useShortName;
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
        useShortName: this.useShortName,
        language: this.language
      }
      this.userService.updateUser(params).then(data => {
        this.authenticationService.useShortName = self.useShortName;
        this.alertService.success('Save setting successfully!!!')
      })
    }

  editAccount() {
    console.log("edit account");

  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  handlerAvatar($event) {
    let self = this;
    let file = $event.target.files[0];
    let fileReader = new FileReader();
    if (file.size > 1000000) {
      this.alertService.error('Chọn lại ảnh, chọn ảnh dưới 1MB');
      return;
    }
    fileReader.onloadend = function(e){
      self.avatar = fileReader.result.toString();
    }
    console.log(file);

    fileReader.readAsDataURL(file);
  }
}
