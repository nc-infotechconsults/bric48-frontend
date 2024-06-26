import { Component } from '@angular/core';
import { NearbyHeadphonesService } from '../../services/nearby-headphones.service';
import { WorkerService } from '../../services/worker.service';
import { Router, NavigationExtras } from '@angular/router';
import { NearbyHeadphones } from '../../models/nearby-headphones';
import { Worker } from '../../models/worker';
import { Machinery } from '../../models/machinery';
import { MachineryService } from '../../services/machinery.service';
import { MachineryDataService } from '../../services/machinery-data.service';
import { MachineryData } from '../../models/machinery-data';

import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { LogService } from '../../services/log.service';

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

  isInAlarm: boolean = false;

  
  constructor(private mqttService: MqttService, private nearbyHeadphonesService:NearbyHeadphonesService, private machineryService:MachineryService, private workerService:WorkerService, private machineryDataService:MachineryDataService, private logService:LogService, private router: Router) {

  }


  //On init
  async ngOnInit() {

    this.mserial = sessionStorage.getItem("mserial")

    this.machinery = await this.machineryService.getMachineryByMserial(this.mserial);

    this.nearbyHeadphones = await this.nearbyHeadphonesService.getNearbyHeadphonesByMserial(this.mserial);

    if (this.nearbyHeadphones !== null) {
      for (const nearbyH of this.nearbyHeadphones) {
        this.w = await this.workerService.getWorkerBySerial(nearbyH.serial)
        this.workers?.push(this.w)
      }
    } 

    this.machineryAlarms = await this.machineryDataService.getMachineryDataByTypeAndMserialAndIsSolved("alarm", this.mserial, "False");

    if (this.machineryAlarms?.length != 0 && this.nearbyHeadphones?.length != 0){
      this.isInAlarm = true
    }else{
      this.isInAlarm = false
    }

    this.startPolling()
  }

  //On destroy
  ngOnDestroy() {
    this.stopPolling();
  }


  // Polling
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

      this.machineryAlarms_temp = await this.machineryDataService.getMachineryDataByTypeAndMserialAndIsSolved("alarm", this.mserial, "False");

      if(!this.isEqual(this.machineryAlarms_temp, this.machineryAlarms)){
        this.machineryAlarms = this.machineryAlarms_temp
      }

      if (this.machineryAlarms?.length != 0 && this.nearbyHeadphones?.length != 0){
        this.isInAlarm = true
      }else{
        this.isInAlarm = false
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

  // Send alarm to nearbyWorkers
  sendMessage() {

    if(this.isInAlarm == false){
      this.goToSendMessages();
    }else{

      if(this.machineryAlarms != null){
        const message = this.machineryAlarms[0].description;
        this.mqttService.unsafePublish('/'+this.mserial, message, { qos: 0, retain: false });
        window.alert("Alarm sent!")
        this.logService.addLog("Alarm sent from machinery with mserial: "+this.mserial)
      }

    }
  }


  // Solve alarm
  async solveAlarm(id: string) {
    await this.machineryDataService.solveAlarm(id);
    this.logService.addLog("Alarm solved from machinery with mserial: "+this.mserial)
  }

  // Send message to all
  goToSendMessages(): void{
    const workersJSON = JSON.stringify(this.workers);
    sessionStorage.setItem('workers', workersJSON);

    this.router.navigate(['/home/messages']);
  }

  // Send message to a worker
  goToSendIndividualMessages(worker: Worker): void{
    const workerJSON = JSON.stringify(worker);
    sessionStorage.setItem('workers', workerJSON);
    
    this.router.navigate(['/home/messages']);
  }

  reloadPage() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([this.router.url]);
  }


}
