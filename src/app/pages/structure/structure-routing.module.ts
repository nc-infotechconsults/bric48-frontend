import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StructureComponent } from './structure.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: StructureComponent }
    ])],
    exports: [RouterModule]
})
export class StructureRoutingModule { }
