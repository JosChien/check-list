import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IClass } from 'src/app/_models';
import { ClassService } from 'src/app/_firebases/class.service';
import { Site } from 'src/app/_until/constant'
import { AlertService, AuthenticationService } from '../_services';
import { UserService } from '../_firebases/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  hide = true;
  formGroup: FormGroup;
  listCatechism: Array<IClass>;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private userService: UserService,
    private classService: ClassService,
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      classes: ['', Validators.required]
    });

    const listCatechism = this.classService.getClasses();
    this.listCatechism = [];
    listCatechism.subscribe(doc => {
      doc.map(data => {
        let catechism: any = data.payload.doc.data();
        catechism.id = data.payload.doc.id;
        this.listCatechism.push(catechism);
      })

    })
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.registerForm.controls[controlName].hasError(errorName);
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    let user = this.registerForm.value;
    user.classes = [user.classes];
    user.role = Site.GLV;
    this.userService.createUser(user)
      .then(data => {
        this.alertService.success('Registration successful', true);
        this.router.navigate(['/login']);
      })
      .catch(error => {
        this.alertService.error(error);
        this.loading = false;
      });
  }
}
