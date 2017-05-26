import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from './material/material.module';
import { AuthService } from './auth.service';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  declarations: [NavbarComponent],
  providers: [AuthService],
  exports: [
    MaterialModule,
    NavbarComponent
  ]
})
export class CoreModule { }
