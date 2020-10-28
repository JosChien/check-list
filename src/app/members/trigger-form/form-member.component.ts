import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MemberService } from 'src/app/_firebases/member.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../_services';

@Component({
  selector: 'app-form-member',
  templateUrl: './form-member.component.html',
  styleUrls: ['./form-member.component.css']
})

export class FormMemberComponent implements OnInit {
  isNew = false;
  showShortDesciption = true;
  formGroup: FormGroup;
  srcImage = '';
  file: string;
  prefixName = '';
  firstName = '';
  lastName = '';
  id = '';
  phoneNumber = '';
  dateOfBirth = '';
  address = '';
  fullNameDad = '';
  phoneNumberDad = '';
  fullNameMom = '';
  phoneNumberMom = '';
  parish = '';
  province = ''

  constructor(
    private formBuilder: FormBuilder,
    private memberService: MemberService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,) {
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      prefixName: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: '',
      phoneNumber: '',
      address: '',
      fullNameDad: '',
      phoneNumberDad: '',
      fullNameMom: '',
      phoneNumberMom: '',
      parish: '',
      province: ''
    });

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.memberService.getMember(id)
      .subscribe(doc => {
        let member:any = doc.payload.data();
        this.prefixName = member.prefixName;
        this.firstName = member.firstName;
        this.lastName = member.lastName;
        this.id =  id;
        if (member.image) {
          this.srcImage =  member.image;
        }
        this.srcImage = member.image;
        if (member.phoneNumber) {
          this.phoneNumber =  member.phoneNumber;
        }
        if (member.dateOfBirth) {
          this.dateOfBirth =  member.dateOfBirth;
        }
        if (member.address) {
          this.address =  member.address;
        }
        if (member.fullNameDad) {
          this.fullNameDad =  member.fullNameDad;
        }
        if (member.phoneNumberDad) {
          this.phoneNumberDad =  member.phoneNumberDad;
        }
        if (member.fullNameMom) {
          this.fullNameMom =  member.fullNameMom;
        }
        if (member.phoneNumberMom) {
          this.phoneNumberMom =  member.phoneNumberMom;
        }
        if (member.parish) {
          this.parish =  member.parish;
        }
        if (member.province) {
          this.province =  member.province;
        }
      })
    } else {
      console.log("create member");
      this.isNew = true;
    }
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.formGroup.controls[controlName].hasError(errorName);
  }

  onSubmit() {
    // console.log('Submitted', this.formGroup.controls['prefixName'].value);
    // console.log('Submitted', this.formGroup.value);
    const {
      prefixName,
      id,
      firstName,
      lastName,
      dateOfBirth,
      phoneNumber,
      fullNameDad,
      phoneNumberDad,
      fullNameMom,
      phoneNumberMom,
      parish,
      address,
      province,
      srcImage
    } = this

    let params = {
      id: null,
      prefixName: prefixName,
      firstName: firstName,
      lastName: lastName,
      dateOfBirth: dateOfBirth,
      phoneNumber: phoneNumber,
      fullNameDad: fullNameDad,
      phoneNumberDad: phoneNumberDad,
      fullNameMom: fullNameMom,
      phoneNumberMom: phoneNumberMom,
      parish: parish,
      province: province,
      address: address,
      image: srcImage
    }

    if (this.isNew) {
      this.memberService.createMember(params)
        .then(data => {
          this.router.navigate(['/members']);
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      params.id = id;
      this.memberService.updateMember(params)
      .then(data => {
        console.log(data, "update");
        this.router.navigate(['/members']);
      })
      .catch(error => {
        console.log(error);
      });
    }
  }

  onCancel() {
    this.router.navigate(['/members']);
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
      self.srcImage = fileReader.result.toString();
    }

    fileReader.readAsDataURL(file);
  }

  alterDescriptionText() {
    this.showShortDesciption = !this.showShortDesciption;
    var element = document.getElementsByClassName("content-form");
    element[0].classList.toggle("toggle-show-form");
  }
}
