import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MachineryComponent } from './components/machinery/machinery.component';
import { BranchComponent } from './components/branch/branch.component';
import { RoomComponent } from './components/room/room.component';

const routes: Routes = [
  {
    path:'',
    component: LoginComponent
  },
  {
    path:'branch',
    component: BranchComponent,
    children: [
      /*{path:'room', component: RoomComponent},
      {path: 'charts', component : ChartsComponent, children: [ {path: 'saw', component:SawChartComponent}, {path: 'lathe', component:LatheChartComponent}]},
      {path: 'info', component : InfoSearchBarComponent, children: [{path: '', component:AllInfoComponent}, {path: 'saw', component:InfoSawComponent}, {path: 'lathe', component:InfoLatheComponent}]},
      {path:'alarms', component: AlarmsSearchBarComponent},*/
    ]
  },
  {
    path:'room',
    component: RoomComponent
  },
  {
    path:'machinery',
    component: MachineryComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
