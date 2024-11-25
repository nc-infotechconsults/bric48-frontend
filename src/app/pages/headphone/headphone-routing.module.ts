import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeadphoneComponent } from './headphone.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: HeadphoneComponent }
    ])],
    exports: [RouterModule]
})
export class HeadphoneRoutingModule { }
