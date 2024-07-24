import { Component } from '@angular/core';
import { MachineryService } from '../../services/machinery.service';
import { Machinery } from '../../models/machinery';
import { NearbyHeadphones } from '../../models/nearby-headphones';
import { Router } from '@angular/router';
import { NearbyHeadphonesService } from '../../services/nearby-headphones.service';
import { MachineryData } from '../../models/machinery-data';
import { MachineryDataService } from '../../services/machinery-data.service';

@Component({
  selector: 'app-machinery',
  templateUrl: './machinery.component.html',
  styleUrl: './machinery.component.scss'
})
export class MachineryComponent {

  machineries: Machinery[] | null = [];
  machineries_view: Machinery[] | null = [];
  alarms: MachineryData[] | null = [];
  nearbyHeadphones: NearbyHeadphones[] | null = [];

  // id della room del macchinario
  idRoom: any = sessionStorage.getItem('idRoom');

  intervalId: any;

  constructor(private machineryService:MachineryService, private machineryDataService:MachineryDataService, private nearbyHeadphonesService:NearbyHeadphonesService, private router: Router) {
  }

  // on init
  async ngOnInit() {
    
    // ottenimento dei macchinari da visualizzare
    this.machineries_view = await this.machineryService.getMachineryByIdRoom(this.idRoom);

    if (this.machineries_view) {
      // per ogni macchinario
      for (const machinery of this.machineries_view) {

        // ottenimento degli allarmi non risolti
        this.alarms = await this.machineryDataService.getMachineryDataByTypeAndMserialAndIsSolved("alarm", machinery.mserial, "False");

        // ottenimento dei lavoratori nelle vicinanze
        this.nearbyHeadphones = await this.nearbyHeadphonesService.getNearbyHeadphonesByMserial(machinery.mserial);

        // numero di lavoratori nelle vicinanze
        machinery.nearbyWorkers = this.nearbyHeadphones?.length

        // se ci sono allarmi e lavoratori nelle vicinanze, impostiamo il parametro dangerousness del macchinario a HIGH
        if(this.alarms?.length != 0 && this.nearbyHeadphones?.length != 0){
          machinery.dangerousness = "HIGH"
        }else{
          machinery.dangerousness = "ZERO"
        }

      }
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

      // ottenimento dei macchinari di una determinata stanza
      this.machineries = await this.machineryService.getMachineryByIdRoom(this.idRoom);

      if (this.machineries) {
        // per ogni macchinario
        for (const machinery of this.machineries) {

          // ottenimento degli allarmi non risolti
          this.alarms = await this.machineryDataService.getMachineryDataByTypeAndMserialAndIsSolved("alarm", machinery.mserial, "False");

          // ottenimento dei lavoratori nelle vicinanze
          this.nearbyHeadphones = await this.nearbyHeadphonesService.getNearbyHeadphonesByMserial(machinery.mserial);

          // numero di lavoratori nelle vicinanze
          machinery.nearbyWorkers = this.nearbyHeadphones?.length
          
          // se ci sono allarmi e lavoratori nelle vicinanze, impostiamo il parametro dangerousness del macchinario a HIGH
          if(this.alarms?.length != 0 && this.nearbyHeadphones?.length != 0){
            machinery.dangerousness = "HIGH"
          }else{
            machinery.dangerousness = "ZERO"
          }
  
        }
      }
      
      // se machineries_view e machineries sono diversi, aggiorniamo i dati da visualizzare
      if (!this.isEqual(this.machineries_view, this.machineries)){
        this.machineries_view = this.machineries
      }
    

    }, 1000); // Esegui ogni secondo
  }

  // fine del polling
  stopPolling() {
    clearInterval(this.intervalId);
  }

  // routing verso la pagina dei dettagli del macchinario
  goToMachineryDetails(mserial: any) {
    sessionStorage.setItem('mserial', mserial)
    this.router.navigate(['home/details']);
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


}
