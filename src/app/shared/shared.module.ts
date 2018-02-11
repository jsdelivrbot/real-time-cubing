import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from '../material/material.module';

import { EventPickerComponent } from './event-picker/event-picker.component';
import { SolvePipe } from './solve/solve.pipe';
import { TimePipe } from './time/time.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  declarations: [EventPickerComponent, SolvePipe, TimePipe],
  providers: [TimePipe],
  exports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    EventPickerComponent,
    SolvePipe,
    TimePipe
  ]
})
export class SharedModule { }
