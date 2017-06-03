import { NgModule } from '@angular/core';

import {
  MdButtonModule,
  MdToolbarModule,
  MdIconModule,
  MdMenuModule,
  MdInputModule,
  MdCheckboxModule,
  MdTooltipModule
} from '@angular/material';

const MATERIAL_MODULES = [
  MdButtonModule,
  MdToolbarModule,
  MdIconModule,
  MdMenuModule,
  MdInputModule,
  MdCheckboxModule,
  MdTooltipModule
];

@NgModule({
  imports: MATERIAL_MODULES,
  exports: MATERIAL_MODULES
})
export class MaterialModule { }
