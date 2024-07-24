import { Component } from '@angular/core';
import { Machinery } from '../../models/machinery';
import { SensorService } from '../../services/sensor.service';
import { MachineryService } from '../../services/machinery.service';
import { Router } from '@angular/router';
import { LogService } from '../../services/log.service';

@Component({
  selector: 'app-edit-sensor',
  templateUrl: './edit-sensor.component.html',
  styleUrl: './edit-sensor.component.scss'
})
export class EditSensorComponent {

  sensor:any = {} as any;

  machineries: Machinery[] | null = [];

  // indirizzo mac del beacon che voliamo modificare
  mac: any = sessionStorage.getItem('macSensor');

  statusCode: number = 0;

  btnDisabled: boolean = false;

  constructor(private sensorService:SensorService, private machineryService:MachineryService, private logService:LogService, private router: Router) {
  }

  // on init
  async ngOnInit() {
    this.btnDisabled = false;

    // ottenimento del beacon
    this.sensor = await this.sensorService.getSensorByMac(this.mac);

    // ottenimento di tutti i macchinari
    this.machineries = await this.machineryService.getAll();
  }

  // on submit
  async onSubmit(form: any) {
    this.btnDisabled = true;

    // se dal menù a tendina si seleziona "No machinery associated", si imposta il campo mserial del beacon a stringa vuota
    if(this.sensor.mserial == "No machinery associated"){
      this.sensor.mserial = ""
    }
    
    // modifica del beacon
    this.statusCode = await this.sensorService.editSensor(this.sensor);

    if (this.statusCode == 0){
      window.alert("Sensor edited!");

      // aggiunta del log
      this.logService.addLog("Edited sensor with MAC: "+this.sensor.mac)

      // routing verso la pagina di visualizzazione dei beacon
      this.router.navigate(['/home/sensors'])
    }

    this.btnDisabled = false;
  }

}
