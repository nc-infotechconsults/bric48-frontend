import { Component } from '@angular/core';
import { NearbyHeadphonesService } from '../../services/nearby-headphones.service';
import { WorkerService } from '../../services/worker.service';
import { Router } from '@angular/router';
import { NearbyHeadphones } from '../../models/nearby-headphones';
import { Worker } from '../../models/worker';
import { Machinery } from '../../models/machinery';
import { MachineryService } from '../../services/machinery.service';
import { MachineryDataService } from '../../services/machinery-data.service';
import { MachineryData } from '../../models/machinery-data';

import { IMqttMessage, MqttService } from 'ngx-mqtt';

@Component({
  selector: 'app-machinery-details',
  templateUrl: './machinery-details.component.html',
  styleUrl: './machinery-details.component.scss'
})
export class MachineryDetailsComponent {

  nearbyHeadphones : NearbyHeadphones[] | null = [];
  machineryAlarms : MachineryData[] | null = [];
  machineryAlarms_temp : MachineryData[] | null = [];
  workers : Worker[] | null = [];
  workers_temp : Worker[] | null = [];
  machinery : Machinery | null = {} as Machinery;

  w : any;

  mserial: any;

  intervalId: any;

  private subscription;
  message: string = "";
  
  constructor(private _mqttService: MqttService, private nearbyHeadphonesService:NearbyHeadphonesService, private machineryService:MachineryService, private workerService:WorkerService, private machineryDataService:MachineryDataService, private router: Router) {
    this.subscription = this._mqttService.observe('/bric48').subscribe((message: IMqttMessage) => {
      this.message = message.payload.toString();
    });
  }


  //On init
  async ngOnInit() {

    this.mserial = localStorage.getItem("mserial")

    this.machinery = await this.machineryService.getMachineryByMserial(this.mserial);

    this.nearbyHeadphones = await this.nearbyHeadphonesService.getNearbyHeadphonesByMserial(this.mserial);

    if (this.nearbyHeadphones !== null) {
      for (const nearbyH of this.nearbyHeadphones) {
        this.w = await this.workerService.getWorkerBySerial(nearbyH.serial)
        this.workers?.push(this.w)
      }
    } 

    this.machineryAlarms = await this.machineryDataService.getMachineryDataByTypeAndMserial("alarm", this.mserial);

    this.startPolling()
  }

  //On destroy
  ngOnDestroy() {
    this.stopPolling();
  }


  startPolling() {
    this.intervalId = setInterval(async () => {

      this.workers_temp = []
      this.nearbyHeadphones = await this.nearbyHeadphonesService.getNearbyHeadphonesByMserial(this.mserial);

      if (this.nearbyHeadphones !== null) {
        for (const nearbyH of this.nearbyHeadphones) {
          this.w = await this.workerService.getWorkerBySerial(nearbyH.serial)
          this.workers_temp?.push(this.w)
        }
      }

      if(!this.isEqual(this.workers_temp, this.workers)){
        this.workers = this.workers_temp
      }

      this.machineryAlarms_temp = await this.machineryDataService.getMachineryDataByTypeAndMserial("alarm", this.mserial);

      if(!this.isEqual(this.machineryAlarms_temp, this.machineryAlarms)){
        this.machineryAlarms = this.machineryAlarms_temp
      }

    }, 1000); // Esegui ogni secondo
  }

  stopPolling() {
    clearInterval(this.intervalId);
  }

  // Funzione per confrontare due array di oggetti
  isEqual(a: object[] | any , b: object[] | any): boolean {
    if (a?.length !== b?.length) {
        return false;
    }
    for (let i = 0; i < a.length; i++) {
        if (JSON.stringify(a[i]) !== JSON.stringify(b[i])) {
            return false;
        }
    }
    return true;
  }

  sendMessage(){
    this._mqttService.unsafePublish('/bric48', 'Ciao mondo', { qos: 1, retain: true });
    console.log("Messaggio inviato")
  }

}
