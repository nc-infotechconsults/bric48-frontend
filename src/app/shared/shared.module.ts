import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';
import { DetailModalComponent } from './components/detail-modal/detail-modal.component';
import { NotificationModalComponent } from './components/notification-modal/notification-modal.component';
import { TableComponent } from './components/table/table.component';


@NgModule({
  declarations: [
    TableComponent,
    DetailModalComponent,
    DeleteDialogComponent,
    NotificationModalComponent
  ],
  imports: [
    CommonModule,
    TableModule,
    CardModule,
    ToggleButtonModule,
    FileUploadModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    TranslateModule,
    ContextMenuModule
  ],
  providers: [
    MessageService
  ],
  exports: [
    TableComponent,
    DeleteDialogComponent,
    DetailModalComponent,
    NotificationModalComponent
  ]
})
export class SharedModule { }
