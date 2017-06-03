import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from '../material/material.module';

import { EventPickerComponent } from './event-picker/event-picker.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  declarations: [EventPickerComponent],
  exports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    EventPickerComponent
  ]
})
export class SharedModule { }
