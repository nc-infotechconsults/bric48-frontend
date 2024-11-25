import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BeaconComponent } from './beacon.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: BeaconComponent }
    ])],
    exports: [RouterModule]
})
export class BeaconRoutingModule { }
