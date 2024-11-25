import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { SharedModule } from 'src/app/shared/shared.module';
import { MachineryRoutingModule } from './machinery-routing.module';
import { MachineryComponent } from './machinery.component';

@NgModule({
  declarations: [MachineryComponent],
  imports: [
    CommonModule,
    SharedModule,
    InputTextModule,
    InputTextareaModule,
    ReactiveFormsModule,
    TranslateModule,
    ToastModule,
    MachineryRoutingModule
  ],
  providers: [MessageService]
})
export class MachineryModule { }
