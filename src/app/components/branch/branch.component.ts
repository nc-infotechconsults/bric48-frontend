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
  branches_view: Branch[] | null = [];
  machineries: Machinery[] | null = [];
  alarms: MachineryData[] | null = [];
  nearbyHeadphones: NearbyHeadphones[] | null = [];

  dataChanged = false;

  intervalId: any;

  constructor(private branchService:BranchService, private machineryService:MachineryService, private machineryDataService:MachineryDataService, private nearbyHeadphonesService:NearbyHeadphonesService, private router: Router) {
  }

  // on init
  async ngOnInit() {

    // branches_view contiene i branch che vengono visualizzati
    this.branches_view = await this.branchService.getAll();

    // si inizializza il parametro dangerousness di ogni branch a ZERO
    if (this.branches_view) {
      for (const branch of this.branches_view) {
          branch.dangerousness = "ZERO"
      }
    }

    this.machineries = await this.machineryService.getAll();

    // per ogni macchinario si ottengono gli allarmi non risolti e i lavoratori nelle vicinanze
    if (this.machineries) {
      for (const machinery of this.machineries) {
        this.alarms = await this.machineryDataService.getMachineryDataByTypeAndMserialAndIsSolved("alarm", machinery.mserial, "False");
        this.nearbyHeadphones = await this.nearbyHeadphonesService.getNearbyHeadphonesByMserial(machinery.mserial);

        // il parametro dangerousness del branch viene impostato ad HIGH se ci sono allarmi e se ci sono lavoratori vicini al macchinario
        if(this.alarms?.length != 0 && this.nearbyHeadphones?.length != 0){
          if (this.branches_view) {
            for (const branch of this.branches_view) {
              if(machinery.idBranch == branch.id){
                branch.dangerousness = "HIGH"
              }
            }
          }
        }

      }
    }

    // inizia il polling
    this.startPolling()
    
  }
  
  // polling
  startPolling() {
    this.intervalId = setInterval(async () => {

      this.dataChanged = false;
      
      // branches contiene i branch
      this.branches = await this.branchService.getAll();
      
      // si inizializza il parametro dangerousness di ogni branch a ZERO
      if (this.branches) {
        for (const branch of this.branches) {
            branch.dangerousness = "ZERO"
        }
      }

      this.machineries = await this.machineryService.getAll();
      
      // per ogni macchinario si ottengono gli allarmi non risolti e i lavoratori nelle vicinanze
      if (this.machineries) {
        for (const machinery of this.machineries) {
          this.alarms = await this.machineryDataService.getMachineryDataByTypeAndMserialAndIsSolved("alarm", machinery.mserial, "False");
          this.nearbyHeadphones = await this.nearbyHeadphonesService.getNearbyHeadphonesByMserial(machinery.mserial);

          // il parametro dangerousness del branch viene impostato ad HIGH se ci sono allarmi e se ci sono lavoratori vicini al macchinario
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
      
      // se branches_view e branches sono diversi, si aggiorna la visualizzazione
      if (!this.isEqual(this.branches_view, this.branches)){
        this.branches_view = this.branches
      }

    }, 1000); // Esegui ogni secondo
  }

  // stop polling
  stopPolling() {
    clearInterval(this.intervalId);
  }

  // on destroy
  ngOnDestroy() {
    this.stopPolling();
  }

  // routing verso la pagina delle room
  goToRoomsPage(idBranch: any) {
    sessionStorage.setItem('idBranch', idBranch);
    this.router.navigate(['home/room']);
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
