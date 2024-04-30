import { Component } from '@angular/core';
import { Branch } from '../../models/branch';
import { BranchService } from '../../services/branch.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-branches-list',
  templateUrl: './branches-list.component.html',
  styleUrl: './branches-list.component.scss'
})
export class BranchesListComponent {

  branches: Branch[] | null = [];
  statusCode: number = 0;

  constructor(private branchService:BranchService, private router: Router) {
  }

  //On init
  async ngOnInit() {
    this.branches = await this.branchService.getAll();
  }

  //On destroy
  ngOnDestroy() {
  }

  goToNewBranchPage(): void {
    this.router.navigate(['/home/branches/new']);
  }

  goToRoomsPage(id: any, name: string): void {
    localStorage.setItem('idBranch', id)
    localStorage.setItem('branchName', name)
    this.router.navigate(['/home/rooms']);
  }

  // Delete branch by id
  async deleteBranch(id: any) {
    this.statusCode = await this.branchService.deleteBranch(id);

    if (this.statusCode == 0){
      this.reloadPage()
      window.alert("Branch deleted!");
    }else{
      window.alert("Error with status code: " + this.statusCode)
    }
  }
  

  // Edit branch by id
  async editBranch(id: any) {
    localStorage.setItem('idBranch', id)
    this.router.navigate(['/home/branches/edit'])
  }

  reloadPage() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([this.router.url]);
  }

}
