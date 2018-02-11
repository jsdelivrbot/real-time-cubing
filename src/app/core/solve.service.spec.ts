import { TestBed, inject } from '@angular/core/testing';

import { SolveService } from './solve.service';

describe('SolveService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SolveService]
    });
  });

  it('should be created', inject([SolveService], (service: SolveService) => {
    expect(service).toBeTruthy();
  }));
});
