import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { SharedModule } from 'src/app/shared/shared.module';
import { AreaRoutingModule } from './area-routing.module';
import { AreaComponent } from './area.component';

@NgModule({
  declarations: [AreaComponent],
  imports: [
    CommonModule,
    SharedModule,
    InputTextModule,
    DropdownModule,
    InputTextareaModule,
    ReactiveFormsModule,
    TranslateModule,
    ToastModule,
    AreaRoutingModule
  ],
  providers: [MessageService]
})
export class AreaModule { }
