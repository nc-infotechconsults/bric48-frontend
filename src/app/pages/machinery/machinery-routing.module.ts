import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MachineryComponent } from './machinery.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: MachineryComponent }
    ])],
    exports: [RouterModule]
})
export class MachineryRoutingModule { }
