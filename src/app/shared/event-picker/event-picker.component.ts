import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { WcaEvent, wcaEvents } from '../../models/wca-event.model';

@Component({
  selector: 'app-event-picker',
  templateUrl: './event-picker.component.html',
  styleUrls: ['./event-picker.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => EventPickerComponent),
    multi: true
  }]
})
export class EventPickerComponent implements ControlValueAccessor {
  private events = wcaEvents;
  private selectedEvent: WcaEvent;
  private onChange: any = () => {};

  constructor() { }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) { }

  writeValue(value: any) {
    this.selectedEvent = value;
  }

  select(event: WcaEvent) {
    this.selectedEvent = event;
    this.onChange(event);
  }
}
