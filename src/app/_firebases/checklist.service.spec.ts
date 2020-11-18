/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ChecklistService } from './checklist.service';

describe('Service: Checklist', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChecklistService]
    });
  });

  it('should ...', inject([ChecklistService], (service: ChecklistService) => {
    expect(service).toBeTruthy();
  }));
});
