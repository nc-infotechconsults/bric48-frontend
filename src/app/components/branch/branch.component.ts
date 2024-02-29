import { Component } from '@angular/core';
import { Branch } from '../../models/branch';
import { BranchService } from '../../services/branch.service';
import { Router } from '@angular/router';
import { NearbyHeadphones } from '../../models/nearby-headphones';
import { NearbyHeadphonesService } from '../../services/nearby-headphones.service';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrl: './branch.component.scss'
})
export class BranchComponent {

  branches: Branch[] | null = [];
  nearbyHeadphones: NearbyHeadphones[] | null = [];

  intervalId: any;

  constructor(private branchService:BranchService, private nearbyHeadphonesService:NearbyHeadphonesService, private router: Router) {
  }

  async ngOnInit() {
    this.branches = await this.branchService.getAll();
    
    if (this.branches) {
      for (const branch of this.branches) {
        this.nearbyHeadphones = await this.nearbyHeadphonesService.getNearbyHeadphonesByIdBranch(branch.id);
        branch.workers_count = this.nearbyHeadphones?.length;
      }
    }

    this.startPolling()
    
  }

  startPolling() {
    this.intervalId = setInterval(async () => {

      this.branches = await this.branchService.getAll();
    
      if (this.branches) {
        for (const branch of this.branches) {
          this.nearbyHeadphones = await this.nearbyHeadphonesService.getNearbyHeadphonesByIdBranch(branch.id);
          branch.workers_count = this.nearbyHeadphones?.length;
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

}
