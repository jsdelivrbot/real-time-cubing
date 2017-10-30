import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolvesComponent } from './solves.component';

describe('SolvesComponent', () => {
  let component: SolvesComponent;
  let fixture: ComponentFixture<SolvesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolvesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolvesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('is created', () => {
    expect(component).toBeTruthy();
  });
});
