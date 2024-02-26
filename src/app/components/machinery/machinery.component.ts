import { Component } from '@angular/core';
import { MachineryService } from '../../services/machinery.service';
import { Machinery } from '../../models/machinery';
import { NearbyHeadphones } from '../../models/nearby-headphones';

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

  constructor(private machineryService:MachineryService) {
  }

  //On init
  async ngOnInit() {

    this.machineries = await this.machineryService.getMachineryByIdRoom(this.idRoom);

    if (this.machineries !== null) {
      for (const machinery of this.machineries) {
        this.nearbyHeadphones = await this.machineryService.getNearbyHeadphonesByMserial(machinery.mserial)
      }
    }  

    this.startPolling()
  }

  //On destroy
  ngOnDestroy() {
    this.stopPolling();
    //localStorage.removeItem('idRoom')
  }


  startPolling() {
    this.intervalId = setInterval(async () => {

      this.machineries = await this.machineryService.getMachineryByIdRoom(this.idRoom);

    if (this.machineries !== null) {
      for (const machinery of this.machineries) {
        this.nearbyHeadphones = await this.machineryService.getNearbyHeadphonesByMserial(machinery.mserial)
        machinery.nearbyWorkers = this.nearbyHeadphones?.length
      }
    }  

    }, 1000); // Esegui ogni secondo
  }

  stopPolling() {
    clearInterval(this.intervalId);
  }



}
