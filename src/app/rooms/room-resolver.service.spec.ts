import { TestBed, inject } from '@angular/core/testing';

import { RoomResolver } from './room-resolver.service';

describe('RoomResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoomResolver]
    });
  });

  it('is created', inject([RoomResolver], (service: RoomResolver) => {
    expect(service).toBeTruthy();
  }));
});
