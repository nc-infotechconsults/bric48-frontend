import { Component } from '@angular/core';
import { MachineryService } from '../../services/machinery.service';
import { Machinery } from '../../models/machinery';
import { NearbyHeadphones } from '../../models/nearby-headphones';
import { count } from 'rxjs';

@Component({
  selector: 'app-machinery',
  templateUrl: './machinery.component.html',
  styleUrl: './machinery.component.scss'
})
export class MachineryComponent {

  machineries: Machinery[] | null = [];
  nearbyHeadphones: NearbyHeadphones[] | null = [];

  intervalId: any;

  constructor(private machineryService:MachineryService) {
  }


  async ngOnInit() {

    this.machineries = await this.machineryService.getAll();

    if (this.machineries !== null) {
      for (const machinery of this.machineries) {
        this.nearbyHeadphones = await this.machineryService.getNearbyHeadphonesByMserial(machinery.mserial)
      }
    }  

    this.startPolling()
  }

  ngOnDestroy() {
    this.stopPolling();
  }

  startPolling() {
    this.intervalId = setInterval(async () => {

    this.machineries = await this.machineryService.getAll();

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
