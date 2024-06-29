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
import { MachineriesListComponent } from './components/machineries-list/machineries-list.component';
import { NewMachineryComponent } from './components/new-machinery/new-machinery.component';
import { EditMachineryComponent } from './components/edit-machinery/edit-machinery.component';
import { BranchesListComponent } from './components/branches-list/branches-list.component';
import { EditBranchComponent } from './components/edit-branch/edit-branch.component';
import { NewBranchComponent } from './components/new-branch/new-branch.component';
import { RoomsListComponent } from './components/rooms-list/rooms-list.component';
import { EditRoomComponent } from './components/edit-room/edit-room.component';
import { NewRoomComponent } from './components/new-room/new-room.component';
import { DataListComponent } from './components/data-list/data-list.component';

import { IMqttServiceOptions, MqttModule } from 'ngx-mqtt';
import { SendMessagesComponent } from './components/send-messages/send-messages.component';
import { MachineryBarComponent } from './components/machinery-bar/machinery-bar.component';
import { EditAccountComponent } from './components/edit-account/edit-account.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LogListComponent } from './components/log-list/log-list.component';
import { MessagesListComponent } from './components/messages-list/messages-list.component';
import { NewMessageComponent } from './components/new-message/new-message.component';

export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: 'test.mosquitto.org',
  port: 8081,
  path: '/mqtt'
};


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
    EditSensorComponent,
    MachineriesListComponent,
    NewMachineryComponent,
    EditMachineryComponent,
    BranchesListComponent,
    EditBranchComponent,
    NewBranchComponent,
    RoomsListComponent,
    EditRoomComponent,
    NewRoomComponent,
    DataListComponent,
    SendMessagesComponent,
    MachineryBarComponent,
    EditAccountComponent,
    LogListComponent,
    MessagesListComponent,
    NewMessageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
