import { Component } from '@angular/core';
import { Sensor } from '../../models/sensor';
import { Machinery } from '../../models/machinery';
import { SensorService } from '../../services/sensor.service';
import { Router } from '@angular/router';
import { MachineryService } from '../../services/machinery.service';

@Component({
  selector: 'app-new-sensor',
  templateUrl: './new-sensor.component.html',
  styleUrl: './new-sensor.component.scss'
})
export class NewSensorComponent {

  sensor:Sensor = {} as Sensor;

  machineries: Machinery[] | null = [];

  statusCode: number = 0;

  btnDisabled: boolean = false;

  constructor(private sensorService:SensorService, private machineryService:MachineryService, private router: Router) {
  }

  async ngOnInit(){
    this.btnDisabled = false;
    this.machineries = await this.machineryService.getAll();
  }

  async onSubmit(form: any) {
    this.btnDisabled = true;

    let existingSensor:Sensor | null = {} as Sensor | null;
    existingSensor = await this.sensorService.getSensorByMac(this.sensor.mac)

    if(existingSensor?.id != null){
      window.alert("A sensor with this MAC address already exists!");
    }else{
      if(this.sensor.mserial == "No machinery associated"){
        this.sensor.mserial = ""
      }
  
      this.statusCode = await this.sensorService.addSensor(this.sensor);
  
      if (this.statusCode == 0){
        window.alert("New sensor added!");
        this.router.navigate(['/home/sensors'])
      }
    }

    
    

    this.btnDisabled = false;
  }

}
