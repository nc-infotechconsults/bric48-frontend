import { Component } from '@angular/core';
import { Branch } from '../../models/branch';
import { BranchService } from '../../services/branch.service';
import { Router } from '@angular/router';
import { NearbyHeadphones } from '../../models/nearby-headphones';
import { NearbyHeadphonesService } from '../../services/nearby-headphones.service';
import { Machinery } from '../../models/machinery';
import { MachineryService } from '../../services/machinery.service';
import { MachineryData } from '../../models/machinery-data';
import { MachineryDataService } from '../../services/machinery-data.service';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrl: './branch.component.scss'
})
export class BranchComponent {

  branches: Branch[] | null = [];
  machineries: Machinery[] | null = [];
  alarms: MachineryData[] | null = [];
  nearbyHeadphones: NearbyHeadphones[] | null = [];

  intervalId: any;

  constructor(private branchService:BranchService, private machineryService:MachineryService, private machineryDataService:MachineryDataService, private nearbyHeadphonesService:NearbyHeadphonesService, private router: Router) {
  }

  async ngOnInit() {
    this.branches = await this.branchService.getAll();

    if (this.branches) {
      for (const branch of this.branches) {
          branch.dangerousness = "ZERO"
      }
    }

    this.machineries = await this.machineryService.getAll();

    if (this.machineries) {
      for (const machinery of this.machineries) {
        this.alarms = await this.machineryDataService.getMachineryDataByTypeAndMserialAndIsSolved("alarm", machinery.mserial, "False");
        this.nearbyHeadphones = await this.nearbyHeadphonesService.getNearbyHeadphonesByMserial(machinery.mserial);

        if(this.alarms?.length != 0 && this.nearbyHeadphones?.length != 0){
          if (this.branches) {
            for (const branch of this.branches) {
              if(machinery.idBranch == branch.id){
                branch.dangerousness = "HIGH"
              }
            }
          }
        }

      }
    }

    this.startPolling()
    
  }

  startPolling() {
    this.intervalId = setInterval(async () => {

      this.branches = await this.branchService.getAll();

      if (this.branches) {
        for (const branch of this.branches) {
            branch.dangerousness = "ZERO"
        }
      }

      this.machineries = await this.machineryService.getAll();

      if (this.machineries) {
        for (const machinery of this.machineries) {
          this.alarms = await this.machineryDataService.getMachineryDataByTypeAndMserialAndIsSolved("alarm", machinery.mserial, "False");
          this.nearbyHeadphones = await this.nearbyHeadphonesService.getNearbyHeadphonesByMserial(machinery.mserial);

          if(this.alarms?.length != 0 && this.nearbyHeadphones?.length != 0){
            if (this.branches) {
              for (const branch of this.branches) {
                if(machinery.idBranch == branch.id){
                  branch.dangerousness = "HIGH"
                }
              }
            }
          }

        }
      }

    }, 1000); // Esegui ogni secondo
  }

  stopPolling() {
    clearInterval(this.intervalId);
  }

  ngOnDestroy() {
    this.stopPolling();
  }

  goToRoomsPage(idBranch: any) {
    localStorage.setItem('idBranch', idBranch);
    this.router.navigate(['home/room']);
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
