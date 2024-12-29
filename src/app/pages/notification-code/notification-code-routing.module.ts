import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotificationCodeComponent } from './notification-code.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: NotificationCodeComponent }
    ])],
    exports: [RouterModule]
})
export class NotificationCodeRoutingModule { }
