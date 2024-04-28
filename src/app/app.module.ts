import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MachineryComponent } from './components/machinery/machinery.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { FormsModule } from '@angular/forms';
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

@NgModule({
  declarations: [
    AppComponent,
    MachineryComponent,
    LoginComponent,
    BranchComponent,
    RoomComponent,
    HomeComponent,
    MachineryDetailsComponent,
    HeadphonesListComponent,
    NewHeadphonesComponent,
    WorkersListComponent,
    NewWorkerComponent,
    EditWorkerComponent,
    SensorsListComponent,
    NewSensorComponent,
    EditSensorComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
