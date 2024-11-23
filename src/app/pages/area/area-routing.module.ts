import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AreaComponent } from './area.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: AreaComponent }
    ])],
    exports: [RouterModule]
})
export class AreaRoutingModule { }
