import { Component } from '@angular/core';
import { Machinery } from '../../models/machinery';
import { SensorService } from '../../services/sensor.service';
import { MachineryService } from '../../services/machinery.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-sensor',
  templateUrl: './edit-sensor.component.html',
  styleUrl: './edit-sensor.component.scss'
})
export class EditSensorComponent {

  sensor:any = {} as any;

  machineries: Machinery[] | null = [];

  mac: any = localStorage.getItem('macSensor');

  statusCode: number = 0;

  btnDisabled: boolean = false;

  constructor(private sensorService:SensorService, private machineryService:MachineryService, private router: Router) {
  }

  //On init
  async ngOnInit() {
    this.btnDisabled = false;
    this.sensor = await this.sensorService.getSensorByMac(this.mac);
    this.machineries = await this.machineryService.getAll();
  }

  async onSubmit(form: any) {
    this.btnDisabled = true;

    if(this.sensor.mserial == "No machinery associated"){
      this.sensor.mserial = ""
    }
    
    this.statusCode = await this.sensorService.editSensor(this.sensor);

    if (this.statusCode == 0){
      window.alert("Sensor edited!");
      this.router.navigate(['/home/sensors'])
    }

    this.btnDisabled = false;
  }

}
