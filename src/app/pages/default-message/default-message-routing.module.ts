import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DefaultMessageComponent } from './default-message.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DefaultMessageComponent }
    ])],
    exports: [RouterModule]
})
export class DefaultMessageRoutingModule { }
