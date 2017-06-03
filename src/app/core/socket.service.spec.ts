import { TestBed, inject } from '@angular/core/testing';

import { SocketService } from './socket.service';

describe('SocketService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SocketService]
    });
  });

  it('is created', inject([SocketService], (service: SocketService) => {
    expect(service).toBeTruthy();
  }));
});
