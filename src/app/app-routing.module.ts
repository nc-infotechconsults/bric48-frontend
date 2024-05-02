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
import { WorkersListComponent } from './components/workers-list/workers-list.component';
import { NewWorkerComponent } from './components/new-worker/new-worker.component';
import { EditWorkerComponent } from './components/edit-worker/edit-worker.component';
import { SensorsListComponent } from './components/sensors-list/sensors-list.component';
import { NewSensorComponent } from './components/new-sensor/new-sensor.component';
import { EditSensorComponent } from './components/edit-sensor/edit-sensor.component';
import { MachineriesListComponent } from './components/machineries-list/machineries-list.component';
import { NewMachineryComponent } from './components/new-machinery/new-machinery.component';
import { EditMachineryComponent } from './components/edit-machinery/edit-machinery.component';
import { BranchesListComponent } from './components/branches-list/branches-list.component';
import { NewBranchComponent } from './components/new-branch/new-branch.component';
import { EditBranchComponent } from './components/edit-branch/edit-branch.component';
import { RoomsListComponent } from './components/rooms-list/rooms-list.component';
import { NewRoomComponent } from './components/new-room/new-room.component';
import { EditRoomComponent } from './components/edit-room/edit-room.component';
import { DataListComponent } from './components/data-list/data-list.component';

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
      {path:'headphones/new', component: NewHeadphonesComponent},
      {path:'workers', component: WorkersListComponent},
      {path:'workers/new', component: NewWorkerComponent},
      {path:'workers/edit', component: EditWorkerComponent},
      {path:'sensors', component: SensorsListComponent},
      {path:'sensors/new', component: NewSensorComponent},
      {path:'sensors/edit', component: EditSensorComponent},
      {path:'machineries', component: MachineriesListComponent},
      {path:'machineries/new', component: NewMachineryComponent},
      {path:'machineries/edit', component: EditMachineryComponent},
      {path:'branches', component: BranchesListComponent},
      {path:'branches/new', component: NewBranchComponent},
      {path:'branches/edit', component: EditBranchComponent},
      {path:'rooms', component: RoomsListComponent},
      {path:'rooms/new', component: NewRoomComponent},
      {path:'rooms/edit', component: EditRoomComponent},
      {path:'data', component: DataListComponent}
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
