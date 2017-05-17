import { NgModule } from '@angular/core';

import {
  MdButtonModule
} from '@angular/material';

const MATERIAL_MODULES = [
  MdButtonModule
];

@NgModule({
  imports: MATERIAL_MODULES,
  exports: MATERIAL_MODULES
})
export class MaterialModule { }
