import { Component } from '@angular/core';
import { MachineryService } from '../../services/machinery.service';
import { Machinery } from '../../models/machinery';
import { NearbyHeadphones } from '../../models/nearby-headphones';
import { Router } from '@angular/router';
import { NearbyHeadphonesService } from '../../services/nearby-headphones.service';

@Component({
  selector: 'app-machinery',
  templateUrl: './machinery.component.html',
  styleUrl: './machinery.component.scss'
})
export class MachineryComponent {

  machineries: Machinery[] | null = [];
  nearbyHeadphones: NearbyHeadphones[] | null = [];

  idRoom: any = localStorage.getItem('idRoom')

  intervalId: any;

  constructor(private machineryService:MachineryService, private nearbyHeadphonesService:NearbyHeadphonesService, private router: Router) {
  }

  //On init
  async ngOnInit() {

    this.machineries = await this.machineryService.getMachineryByIdRoom(this.idRoom);

    if (this.machineries !== null) {
      for (const machinery of this.machineries) {
        this.nearbyHeadphones = await this.nearbyHeadphonesService.getNearbyHeadphonesByMserial(machinery.mserial)
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

    if (this.machineries !== null) {
      for (const machinery of this.machineries) {
        this.nearbyHeadphones = await this.nearbyHeadphonesService.getNearbyHeadphonesByMserial(machinery.mserial)
        machinery.nearbyWorkers = this.nearbyHeadphones?.length
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
