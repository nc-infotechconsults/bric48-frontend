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
    this.workersArray = await this.workerService.getWorkersFromTo(1, this.itemsPerPage + 1);

    if(this.workersArray){
      if(this.workersArray.length <= this.itemsPerPage){
        this.totalPages = true;
      }else{
        this.workersArray.pop();
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
  async deleteWorker(worker: Worker) {

    if (window.confirm('Are you sure you want to delete the worker ' + worker.rollNumber + '?')) {

      this.statusCode = await this.workerService.deleteWorker(worker.id, worker.idHeadphones);

      if (this.statusCode == 0){
        this.reloadPage()
        window.alert("Worker deleted!");
      }else{
        window.alert("Error with status code: " + this.statusCode)
      }
    }
  }

  // Edit worker by id
  async editWorker(id: any) {
    sessionStorage.setItem('idWorker', id)
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
      this.workersArray = await this.workerService.getWorkersFromTo(startIndex + 1, startIndex + this.itemsPerPage);
      this.totalPages = false
    }
  }

  async goToNextPage() {
    if (!this.totalPages) {
      this.currentPage++;
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      this.workersArray = await this.workerService.getWorkersFromTo(startIndex + 1, startIndex + this.itemsPerPage + 1);

      if(this.workersArray){
        if(this.workersArray?.length < this.itemsPerPage){
          this.totalPages = true
        }else{
          this.workersArray.pop();
        }
      }
    }
  }


  // Funzioni per esportare gli elementi di dataArray in formato CSV
  
  convertToCSV(objArray: any[]): string {
    const array = [Object.keys(objArray[0])].concat(objArray);
    return array.map(it => {
      return Object.values(it).toString();
    }).join('\n');
  }

  downloadCSV(csv: string, filename: string): void {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    a.click();
  }

  async exportToCSV(){
    if(this.workersArray){
      const csvData = this.convertToCSV(this.workersArray);
      this.downloadCSV(csvData, "Workers_List");
    }
  }


}
