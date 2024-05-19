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
  alarms: MachineryData[] | null = [];
  nearbyHeadphones: NearbyHeadphones[] | null = [];

  idRoom: any = localStorage.getItem('idRoom');

  intervalId: any;

  constructor(private machineryService:MachineryService, private machineryDataService:MachineryDataService, private nearbyHeadphonesService:NearbyHeadphonesService, private router: Router) {
  }

  //On init
  async ngOnInit() {

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

    

    }, 1000); // Esegui ogni secondo
  }

  stopPolling() {
    clearInterval(this.intervalId);
  }


  goToMachineryDetails(mserial: any) {
    localStorage.setItem('mserial', mserial)
    this.router.navigate(['home/details']);
  }


}
