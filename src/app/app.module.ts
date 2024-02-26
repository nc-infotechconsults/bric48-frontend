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

@NgModule({
  declarations: [
    AppComponent,
    MachineryComponent,
    LoginComponent,
    BranchComponent,
    RoomComponent
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
