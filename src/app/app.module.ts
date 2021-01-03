import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// used to create fake backend
import { fakeBackendProvider } from './_helpers';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from "@angular/fire";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { AngularFirestoreModule, FirestoreSettingsToken } from "@angular/fire/firestore";

import { environment } from "../environments/environment";
import { CustomerDetailsComponent } from './customers/customer-details/customer-details.component';
import { CustomerListComponent } from './customers/customer-list/customer-list.component';
import { CreateCustomerComponent } from './customers/create-customer/create-customer.component';

import { AlertComponent } from './_components';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { GridMemberListComponent } from './members/member-list/GridMemberList/grid-member-list.component';
import { TableMemberListComponent } from './members/member-list/TableMemberList/table-member-list.component';
import { FormUpdateComponent } from './members/form-update/form-update.component';
import { AppMaterialModule } from './app-material.module';
import { DatePipe } from '@angular/common';
import { SettingsComponent } from './settings/settings.component';
import { UsersComponent } from './users/users.component';
import { FormUpdateUserComponent } from './_components/DialogUpdateUser/dialog-update-user.component'
import { AccountComponent } from './account/account.component';
import { ClassesComponent } from './classes/classes.component';
import { DialogUpdateClassesComponent } from 'src/app/_components/DialogUpdateClasses/DialogUpdateClasses.component'
import { DialogChooseClassComponent } from 'src/app/_components/DialogChooseClass/DialogChooseClass.component'
import { DialogHandleReasonComponent } from 'src/app/_components/DialogHandleReason/DialogHandleReason.component'
import { DialogEditCheckListComponent } from 'src/app/_components/DialogEditCheckList/DialogEditCheckList.component'
@NgModule({
  declarations: [
    AppComponent,
    CustomerDetailsComponent,
    CustomerListComponent,
    CreateCustomerComponent,
    AlertComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    SidebarComponent,
    MemberListComponent,
    TableMemberListComponent,
    GridMemberListComponent,
    FormUpdateComponent,
    SettingsComponent,
    UsersComponent,
    FormUpdateUserComponent,
    AccountComponent,
    ClassesComponent,
    DialogUpdateClassesComponent,
    DialogChooseClassComponent,
    DialogHandleReasonComponent,
    DialogEditCheckListComponent
   ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppMaterialModule
  ],
  providers: [
    { provide: FirestoreSettingsToken, useValue: {} },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    DatePipe,

    // provider used to create fake backend
    fakeBackendProvider
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    FormUpdateUserComponent,
    DialogUpdateClassesComponent,
    DialogChooseClassComponent,
    DialogHandleReasonComponent,
    DialogEditCheckListComponent
  ],
})
export class AppModule { }
