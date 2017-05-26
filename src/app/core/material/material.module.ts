import { NgModule } from '@angular/core';

import {
  MdButtonModule,
  MdToolbarModule
} from '@angular/material';

const MATERIAL_MODULES = [
  MdButtonModule,
  MdToolbarModule
];

@NgModule({
  imports: MATERIAL_MODULES,
  exports: MATERIAL_MODULES
})
export class MaterialModule { }
