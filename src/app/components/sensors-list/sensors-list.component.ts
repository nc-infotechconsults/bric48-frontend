import { Component } from '@angular/core';
import { Sensor } from '../../models/sensor';
import { SensorService } from '../../services/sensor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sensors-list',
  templateUrl: './sensors-list.component.html',
  styleUrl: './sensors-list.component.scss'
})
export class SensorsListComponent {

  sensorsArray: Sensor[] | null = [];
  statusCode: number = 0;

  constructor(private sensorService:SensorService, private router: Router) {
  }

  //On init
  async ngOnInit() {
    this.sensorsArray = await this.sensorService.getAll();
  }

  //On destroy
  ngOnDestroy() {
  }

  goToNewSensorPage(): void {
    this.router.navigate(['/home/sensors/new']);
  }

  // Delete sensor by mac
  async deleteSensor(mac: any) {
    this.statusCode = await this.sensorService.deleteSensor(mac);

    if (this.statusCode == 0){
      this.reloadPage()
      window.alert("Sensor deleted!");
    }else{
      window.alert("Error with status code: " + this.statusCode)
    }
  }

  // Edit sensor by mac
  async editSensor(mac: any) {
    localStorage.setItem('macSensor', mac)
    this.router.navigate(['/home/sensors/edit'])
  }

  reloadPage() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([this.router.url]);
  }

}
