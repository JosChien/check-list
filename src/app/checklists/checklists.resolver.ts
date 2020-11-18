import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';

import { environment } from '../../environments/environment';
import { IChecklist } from '../_models/ichecklist';
import { MemberService } from '../_firebases/member.service';
import { IMemberAbsent } from '../_models';
import { SortService } from '../_services';
import { DatePipe } from '@angular/common';

@Injectable()
export class ChecklistResolver implements Resolve<IChecklist> {

  constructor(
    private router: Router,
    private memberService: MemberService,
    private sortService: SortService,
    private datePipe: DatePipe) { }

  resolve(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<IChecklist> {
    const id = route.paramMap.get('id');
    let memberList: Array<IMemberAbsent> = [];
    console.log('resolver', id);

    if (id === environment.NewEntityURLParameters.NewChecklist) {
      let checklist: IChecklist = {
        id: '',
        course: '',
        dates: [],
        class: {id: '' },
        members: memberList
      };
      console.log('in resolver', checklist);

      return of(checklist);
    }
    // else {
    //   if (Number(id) === NaN || Number(id) === 0) {
    //     this.router.navigate(['/notfound']);
    //   }

    //   // tslint:disable-next-line:max-line-length
    //   return this.memberService.getMember(id);
    // }
  }
}
