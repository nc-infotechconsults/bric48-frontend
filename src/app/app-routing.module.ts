import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MachineryComponent } from './components/machinery/machinery.component';
import { BranchComponent } from './components/branch/branch.component';
import { RoomComponent } from './components/room/room.component';
import { HomeComponent } from './components/home/home.component';
import { MachineryDetailsComponent } from './components/machinery-details/machinery-details.component';
import { HeadphonesListComponent } from './components/headphones-list/headphones-list.component';
import { NewHeadphonesComponent } from './components/new-headphones/new-headphones.component';

const routes: Routes = [
  {
    path:'',
    component: LoginComponent
  },
  {
    path:'home',
    component: HomeComponent,
    children: [
      {path:'branch', component: BranchComponent},
      {path:'room', component: RoomComponent},
      {path:'machinery', component: MachineryComponent},
      {path:'details', component: MachineryDetailsComponent},
      {path:'headphones', component: HeadphonesListComponent},
      {path:'headphones/new', component: NewHeadphonesComponent}
      /*{path: 'charts', component : ChartsComponent, children: [ {path: 'saw', component:SawChartComponent}, {path: 'lathe', component:LatheChartComponent}]},
      {path: 'info', component : InfoSearchBarComponent, children: [{path: '', component:AllInfoComponent}, {path: 'saw', component:InfoSawComponent}, {path: 'lathe', component:InfoLatheComponent}]},
      {path:'alarms', component: AlarmsSearchBarComponent},*/
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
