import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { SharedModule } from 'src/app/shared/shared.module';
import { StructureRoutingModule } from './structure-routing.module';
import { StructureComponent } from './structure.component';

@NgModule({
  declarations: [StructureComponent],
  imports: [
    CommonModule,
    SharedModule,
    InputTextModule,
    InputTextareaModule,
    ReactiveFormsModule,
    TranslateModule,
    ToastModule,
    StructureRoutingModule
  ],
  providers: [MessageService]
})
export class StructureModule { }
