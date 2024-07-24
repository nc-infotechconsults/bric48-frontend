import { Component } from '@angular/core';
import { Sensor } from '../../models/sensor';
import { Machinery } from '../../models/machinery';
import { SensorService } from '../../services/sensor.service';
import { Router } from '@angular/router';
import { MachineryService } from '../../services/machinery.service';
import { LogService } from '../../services/log.service';

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

  constructor(private sensorService:SensorService, private machineryService:MachineryService, private logService:LogService, private router: Router) {
  }

  // on init
  async ngOnInit(){
    this.btnDisabled = false;
    this.machineries = await this.machineryService.getAll();
  }

  // on submit
  async onSubmit(form: any) {
    this.btnDisabled = true;

    let existingSensor:Sensor | null = {} as Sensor | null;

    // ottenimento del beacon con il mac inserito
    existingSensor = await this.sensorService.getSensorByMac(this.sensor.mac)

    // se il beacon esiste già
    if(existingSensor?.id != null){
      window.alert("A sensor with this MAC address already exists!");
    }else{
      // se è stato selezionato "No machinery associated" dal menu a tendina si imposta il campo mserial del beacon a stringa vuota
      if(this.sensor.mserial == "No machinery associated"){
        this.sensor.mserial = ""
      }
      
      // aggiunta del beacon
      this.statusCode = await this.sensorService.addSensor(this.sensor);
  
      if (this.statusCode == 0){
        window.alert("New sensor added!");
        
        // se il beacon non è associato ad un macchinario
        if(this.sensor.mserial == ""){
          // aggiunta del log
          this.logService.addLog("Added sensor with MAC "+this.sensor.mac+" and no machinery associated")
        }else{
          // aggiunta del log
          this.logService.addLog("Added sensor with MAC "+this.sensor.mac+" associated with machinery "+this.sensor.mserial)
        }
        
        // routing verso la pagina di visualizzazione dei beacon
        this.router.navigate(['/home/sensors'])
      }
    }

    
    

    this.btnDisabled = false;
  }

}
