import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AreaRoutingModule } from './area-routing.module';
import { AreaComponent } from './area.component';



@NgModule({
  declarations: [AreaComponent],
  imports: [
    CommonModule,
    SharedModule,
    AreaRoutingModule
  ]
})
export class AreaModule { }
