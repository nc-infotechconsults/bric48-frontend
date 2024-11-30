import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { SharedModule } from 'src/app/shared/shared.module';
import { MachineryNotificationRoutingModule } from './machinery-notification-routing.module';
import { MachineryNotificationComponent } from './machinery-notification.component';

@NgModule({
  declarations: [MachineryNotificationComponent],
  imports: [
    CommonModule,
    SharedModule,
    InputTextModule,
    InputTextareaModule,
    ReactiveFormsModule,
    DropdownModule,
    MultiSelectModule,
    TranslateModule,
    ToastModule,
    MachineryNotificationRoutingModule
  ],
  providers: [MessageService]
})
export class MachineryNotificationModule { }
