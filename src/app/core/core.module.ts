import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../material/material.module';
import { AuthService } from './auth.service';
import { SocketService } from './socket.service';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthGuard } from './auth-guard.service';
import { SolveService } from './solve.service';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  declarations: [NavbarComponent],
  providers: [
    AuthService,
    SocketService,
    AuthGuard,
    SolveService
  ],
  exports: [
    NavbarComponent
  ]
})
export class CoreModule { }
