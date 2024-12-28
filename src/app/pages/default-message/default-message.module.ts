import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { DefaultMessageRoutingModule } from './default-message-routing.module';
import { DefaultMessageComponent } from './default-message.component';

@NgModule({
  declarations: [DefaultMessageComponent],
  imports: [
    CommonModule,
    SharedModule,
    InputTextModule,
    InputSwitchModule,
    InputTextareaModule,
    DropdownModule,
    ReactiveFormsModule,
    TranslateModule,
    ToastModule,
    ButtonModule,
    TableModule,
    ToolbarModule,
    DialogModule,
    DefaultMessageRoutingModule
  ],
  providers: [MessageService]
})
export class DefaultMessageModule { }
