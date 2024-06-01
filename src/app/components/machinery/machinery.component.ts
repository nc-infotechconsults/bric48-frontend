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

  idRoom: any = sessionStorage.getItem('idRoom');

  intervalId: any;

  constructor(private machineryService:MachineryService, private machineryDataService:MachineryDataService, private nearbyHeadphonesService:NearbyHeadphonesService, private router: Router) {
  }

  //On init
  async ngOnInit() {

    this.machineries_view = await this.machineryService.getMachineryByIdRoom(this.idRoom);

    if (this.machineries_view) {
      for (const machinery of this.machineries_view) {
        this.alarms = await this.machineryDataService.getMachineryDataByTypeAndMserialAndIsSolved("alarm", machinery.mserial, "False");
        this.nearbyHeadphones = await this.nearbyHeadphonesService.getNearbyHeadphonesByMserial(machinery.mserial);
        machinery.nearbyWorkers = this.nearbyHeadphones?.length

        if(this.alarms?.length != 0 && this.nearbyHeadphones?.length != 0){
          machinery.dangerousness = "HIGH"
        }else{
          machinery.dangerousness = "ZERO"
        }

      }
    }

    this.startPolling()
  }

  //On destroy
  ngOnDestroy() {
    this.stopPolling();
  }


  startPolling() {
    this.intervalId = setInterval(async () => {

      this.machineries = await this.machineryService.getMachineryByIdRoom(this.idRoom);

      if (this.machineries) {
        for (const machinery of this.machineries) {
          this.alarms = await this.machineryDataService.getMachineryDataByTypeAndMserialAndIsSolved("alarm", machinery.mserial, "False");
          this.nearbyHeadphones = await this.nearbyHeadphonesService.getNearbyHeadphonesByMserial(machinery.mserial);
          machinery.nearbyWorkers = this.nearbyHeadphones?.length
  
          if(this.alarms?.length != 0 && this.nearbyHeadphones?.length != 0){
            machinery.dangerousness = "HIGH"
          }else{
            machinery.dangerousness = "ZERO"
          }
  
        }
      }

      if (!this.isEqual(this.machineries_view, this.machineries)){
        this.machineries_view = this.machineries
      }
    

    }, 1000); // Esegui ogni secondo
  }

  stopPolling() {
    clearInterval(this.intervalId);
  }


  goToMachineryDetails(mserial: any) {
    sessionStorage.setItem('mserial', mserial)
    this.router.navigate(['home/details']);
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


}
