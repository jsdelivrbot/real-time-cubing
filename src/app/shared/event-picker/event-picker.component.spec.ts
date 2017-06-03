import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventPickerComponent } from './event-picker.component';

describe('EventPickerComponent', () => {
  let component: EventPickerComponent;
  let fixture: ComponentFixture<EventPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('is created', () => {
    expect(component).toBeTruthy();
  });
});
