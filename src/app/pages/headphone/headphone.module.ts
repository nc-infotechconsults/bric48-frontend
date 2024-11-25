import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { SharedModule } from 'src/app/shared/shared.module';
import { HeadphoneRoutingModule } from './headphone-routing.module';
import { HeadphoneComponent } from './headphone.component';

@NgModule({
  declarations: [HeadphoneComponent],
  imports: [
    CommonModule,
    SharedModule,
    InputTextModule,
    InputTextareaModule,
    ReactiveFormsModule,
    TranslateModule,
    ToastModule,
    HeadphoneRoutingModule
  ],
  providers: [MessageService]
})
export class HeadphoneModule { }
