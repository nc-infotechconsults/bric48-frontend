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


  // on init
  async ngOnInit() {

    // mserial del macchinario del quale vogliamo vedere i dettagli
    this.mserial = sessionStorage.getItem("mserial")

    // ottenimento del macchinario
    this.machinery = await this.machineryService.getMachineryByMserial(this.mserial);

    // ottenimento dei lavoratori nellle vicinanze del macchinario
    this.nearbyHeadphones = await this.nearbyHeadphonesService.getNearbyHeadphonesByMserial(this.mserial);

    if (this.nearbyHeadphones !== null) {
      // per ogni lavoratore nelle vicinanze
      for (const nearbyH of this.nearbyHeadphones) {
        // ottenimento del lavoratore e aggiunta alla lista
        this.w = await this.workerService.getWorkerBySerial(nearbyH.serial)
        this.workers?.push(this.w)
      }
    } 
    
    // ottenimento degli allarmi non risolti per il macchinario
    this.machineryAlarms = await this.machineryDataService.getMachineryDataByTypeAndMserialAndIsSolved("alarm", this.mserial, "False");

    // se ci sono allarmi e lavoratori nelle vicinanze, il flag viene impostato a True
    if (this.machineryAlarms?.length != 0 && this.nearbyHeadphones?.length != 0){
      this.isInAlarm = true
    }else{
      this.isInAlarm = false
    }

    // inizio del polling
    this.startPolling()
  }

  // on destroy
  ngOnDestroy() {
    this.stopPolling();
  }


  // polling
  startPolling() {
    this.intervalId = setInterval(async () => {

      // lista temporanea dei lavoratori
      this.workers_temp = []

      // ottenimento dei lavoratori nelle vicinanze
      this.nearbyHeadphones = await this.nearbyHeadphonesService.getNearbyHeadphonesByMserial(this.mserial);

      if (this.nearbyHeadphones !== null) {
        // per ogni lavoratore nelle vicinanze
        for (const nearbyH of this.nearbyHeadphones) {
          // ottenimento del lavoratore e aggiunta alla lista temporanea
          this.w = await this.workerService.getWorkerBySerial(nearbyH.serial)
          this.workers_temp?.push(this.w)
        }
      }

      // se workers_temp è duverso da workers, aggiorno workers per la visualizzazione
      if(!this.isEqual(this.workers_temp, this.workers)){
        this.workers = this.workers_temp
      }

      // ottenimento degli allarmi non risolti per il macchinario
      this.machineryAlarms_temp = await this.machineryDataService.getMachineryDataByTypeAndMserialAndIsSolved("alarm", this.mserial, "False");

      // se machineryAlarms_temp è duverso da machineryAlarms, aggiorno machineryAlarms per la visualizzazione
      if(!this.isEqual(this.machineryAlarms_temp, this.machineryAlarms)){
        this.machineryAlarms = this.machineryAlarms_temp
      }

      // se ci sono allarmi e lavoratori nelle vicinanze, il flag viene impostato a True
      if (this.machineryAlarms?.length != 0 && this.nearbyHeadphones?.length != 0){
        this.isInAlarm = true
      }else{
        this.isInAlarm = false
      }

    }, 1000); // Esegui ogni secondo
  }
  
  // fine del polling
  stopPolling() {
    clearInterval(this.intervalId);
  }

  // funzione per confrontare due array di oggetti
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

  // funzione per l'invio di messaggi ai lavoratori
  sendMessage() {

    // se il macchinario NON è in allarme, effettuo il routing verso la pagina per l'invio del messaggi
    if(this.isInAlarm == false){

      this.goToSendMessages();

    }else{ // il macchinario è in allarme

      if(this.machineryAlarms != null){
        const message = this.machineryAlarms[0].description;

        // publish del messaggio MQTT a tutti i lavoratori nelle vicinanze del macchinario
        this.mqttService.unsafePublish('/'+this.mserial, message, { qos: 0, retain: false });

        window.alert("Alarm sent!")

        // aggiunta del log
        this.logService.addLog("Alarm sent from machinery with mserial: "+this.mserial)
      }

    }
  }


  // funzione per la risoluzione dell'allarme
  async solveAlarm(id: string) {

    // risoluzione dell'allarme
    await this.machineryDataService.solveAlarm(id);

    // aggiunta del log
    this.logService.addLog("Alarm solved from machinery with mserial: "+this.mserial)
  }

  // routing verso la pagina per l'invio dei messaggi a più lavoratori
  goToSendMessages(): void{
    const workersJSON = JSON.stringify(this.workers);
    sessionStorage.setItem('workers', workersJSON);

    this.router.navigate(['/home/messages']);
  }

  // routing verso la pagina per l'invio dei messaggi ad un singolo lavoratore
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
