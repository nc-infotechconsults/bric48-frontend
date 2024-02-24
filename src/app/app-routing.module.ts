import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MachineryComponent } from './components/machinery/machinery.component';

const routes: Routes = [
  {
    path:'',
    component: LoginComponent
  },
  {
    path:'home',
    component: MachineryComponent,
    /*children: [
      {path:'', component: WelcomeComponent},
      {path: 'charts', component : ChartsComponent, children: [ {path: 'saw', component:SawChartComponent}, {path: 'lathe', component:LatheChartComponent}]},
      {path: 'info', component : InfoSearchBarComponent, children: [{path: '', component:AllInfoComponent}, {path: 'saw', component:InfoSawComponent}, {path: 'lathe', component:InfoLatheComponent}]},
      {path:'alarms', component: AlarmsSearchBarComponent},
    ]*/
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
