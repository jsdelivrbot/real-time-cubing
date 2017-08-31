import { TestBed, inject } from '@angular/core/testing';

import { RoomDataResolver } from './room-data-resolver.service';

describe('RoomDataResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoomDataResolver]
    });
  });

  it('is created', inject([RoomDataResolver], (service: RoomDataResolver) => {
    expect(service).toBeTruthy();
  }));
});
