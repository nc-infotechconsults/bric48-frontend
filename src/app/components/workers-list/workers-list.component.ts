import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Worker } from '../../models/worker';
import { WorkerService } from '../../services/worker.service';

@Component({
  selector: 'app-workers-list',
  templateUrl: './workers-list.component.html',
  styleUrl: './workers-list.component.scss'
})
export class WorkersListComponent {
  
  workersArray: Worker[] | null = [];
  statusCode: number = 0;

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = false;

  constructor(private workerService:WorkerService, private router: Router) {
  }

  //On init
  async ngOnInit() {
    this.workersArray = await this.workerService.getWorkersFromTo(1, this.itemsPerPage);

    if(this.workersArray){
      if(this.workersArray.length < this.itemsPerPage){
        this.totalPages = true;
      }
    }
  }

  //On destroy
  ngOnDestroy() {
  }

  goToNewWorkerPage(): void {
    this.router.navigate(['/home/workers/new']);
  }

  // Delete worker by id
  async deleteWorker(id: any, idHeadphones: any) {
    this.statusCode = await this.workerService.deleteWorker(id, idHeadphones);

    if (this.statusCode == 0){
      this.reloadPage()
      window.alert("Worker deleted!");
    }else{
      window.alert("Error with status code: " + this.statusCode)
    }
  }

  // Edit worker by id
  async editWorker(id: any) {
    localStorage.setItem('idWorker', id)
    this.router.navigate(['/home/workers/edit'])
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
      this.workersArray = await this.workerService.getWorkersFromTo(startIndex, startIndex + this.itemsPerPage - 1);
      this.totalPages = false
    }
  }

  async goToNextPage() {
    if (!this.totalPages) {
      this.currentPage++;
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      this.workersArray = await this.workerService.getWorkersFromTo(startIndex, startIndex + this.itemsPerPage - 1);

      if(this.workersArray){
        if(this.workersArray?.length < this.itemsPerPage){
          this.totalPages = true
        }
      }
    }
  }


}
