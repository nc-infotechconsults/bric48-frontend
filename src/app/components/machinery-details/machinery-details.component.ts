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

@Component({
  selector: 'app-machinery-details',
  templateUrl: './machinery-details.component.html',
  styleUrl: './machinery-details.component.scss'
})
export class MachineryDetailsComponent {

  nearbyHeadphones : NearbyHeadphones[] | null = [];
  machineryAlarms : MachineryData[] | null = [];
  workers : Worker[] | null = [];
  machinery : Machinery | null = {} as Machinery;

  w : any;

  mserial: any;

  intervalId: any;
  
  constructor(private nearbyHeadphonesService:NearbyHeadphonesService, private machineryService:MachineryService, private workerService:WorkerService, private machineryDataService:MachineryDataService, private router: Router) {
  }


  //On init
  async ngOnInit() {

    this.mserial = localStorage.getItem("mserial")

    this.machinery = await this.machineryService.getMachineryByMserial(this.mserial);

    this.machineryAlarms = await this.machineryDataService.getMachineryDataByTypeAndMserial("alarm", this.mserial);


    this.nearbyHeadphones = await this.nearbyHeadphonesService.getNearbyHeadphonesByMserial(this.mserial);

    if (this.nearbyHeadphones !== null) {
      for (const nearbyH of this.nearbyHeadphones) {
        this.w = await this.workerService.getWorkerBySerial(nearbyH.serial)
        this.workers?.push(this.w)
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

      this.workers = []
      this.nearbyHeadphones = await this.nearbyHeadphonesService.getNearbyHeadphonesByMserial(this.mserial);

      if (this.nearbyHeadphones !== null) {
        for (const nearbyH of this.nearbyHeadphones) {
          this.w = await this.workerService.getWorkerBySerial(nearbyH.serial)
          this.workers?.push(this.w)
        }
      }

      this.machineryAlarms = await this.machineryDataService.getMachineryDataByTypeAndMserial("alarm", this.mserial);

    }, 1000); // Esegui ogni secondo
  }

  stopPolling() {
    clearInterval(this.intervalId);
  }

}
