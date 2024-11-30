import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MessageComponent } from './message.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: MessageComponent }
    ])],
    exports: [RouterModule]
})
export class DefaultMessageRoutingModule { }
