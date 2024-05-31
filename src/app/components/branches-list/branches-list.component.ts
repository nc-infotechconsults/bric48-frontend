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

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = false;

  constructor(private branchService:BranchService, private router: Router) {
  }

  //On init
  async ngOnInit() {
    this.branches = await this.branchService.getBranchesFromTo(1, this.itemsPerPage + 1);

    if(this.branches){
      if(this.branches.length <= this.itemsPerPage){
        this.totalPages = true;
      }else{
        this.branches.pop();
      }
    }
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
  async deleteBranch(branch: Branch) {

    if (window.confirm('Are you sure you want to delete the branch ' + branch.name + '?')) {
      this.statusCode = await this.branchService.deleteBranch(branch.id);

      if (this.statusCode == 0){
        this.reloadPage()
        window.alert("Branch deleted!");
      }else{
        window.alert("Error with status code: " + this.statusCode)
      }
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


  async goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      this.branches = await this.branchService.getBranchesFromTo(startIndex + 1, startIndex + this.itemsPerPage);
      this.totalPages = false
    }
  }

  async goToNextPage() {
    if (!this.totalPages) {
      this.currentPage++;
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      this.branches = await this.branchService.getBranchesFromTo(startIndex + 1, startIndex + this.itemsPerPage + 1);

      if(this.branches){
        if(this.branches?.length <= this.itemsPerPage){
          this.totalPages = true
        }else{
          this.branches.pop();
        }
      }
    }
  }

}
