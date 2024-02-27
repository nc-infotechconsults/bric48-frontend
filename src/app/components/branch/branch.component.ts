import { Component } from '@angular/core';
import { Branch } from '../../models/branch';
import { BranchService } from '../../services/branch.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrl: './branch.component.scss'
})
export class BranchComponent {

  branches: Branch[] | null = [];

  constructor(private branchService:BranchService, private router: Router) {
  }

  async ngOnInit() {
    this.branches = await this.branchService.getAll();
  }

  goToRoomsPage(idBranch: any) {
    localStorage.setItem('idBranch', idBranch)
    this.router.navigate(['home/room']);
  }

}
