import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MachineryNotificationComponent } from './machinery-notification.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: MachineryNotificationComponent }
    ])],
    exports: [RouterModule]
})
export class MachineryNotificationRoutingModule { }
