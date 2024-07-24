import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Worker } from '../../models/worker';
import { WorkerService } from '../../services/worker.service';
import { LogService } from '../../services/log.service';

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

  constructor(private workerService:WorkerService, private logService:LogService, private router: Router) {
  }

  // on init
  async ngOnInit() {

    // ottenimento dei primi itemsPerPage + 1 lavoratori
    this.workersArray = await this.workerService.getWorkersFromTo(1, this.itemsPerPage + 1);

    // se il numero di lavoratori è <= al numero di item visualizzabili nella pagina, si imposta il flag totalPages a true
    // altrimenti si elimina l'undicesimo elemento dall'array che serve solo a vedere se esistono pagine successive a quella corrente
    if(this.workersArray){
      if(this.workersArray.length <= this.itemsPerPage){
        this.totalPages = true;
      }else{
        this.workersArray.pop();
      }
    }
  }

  // on destroy
  ngOnDestroy() {
  }

  // routing verso la pagina di aggiunta di un nuovo lavoratore
  goToNewWorkerPage(): void {
    this.router.navigate(['/home/workers/new']);
  }

  // eliminazione di un lavoratore
  async deleteWorker(worker: Worker) {

    if (window.confirm('Are you sure you want to delete the worker ' + worker.rollNumber + '?')) {

      // eliminazione di un lavoratore se la scelta è stata confermata
      this.statusCode = await this.workerService.deleteWorker(worker.id, worker.idHeadphones);

      if (this.statusCode == 0){

        // aggiorna la pagina
        this.reloadPage()

        window.alert("Worker deleted!");

        // aggiunta del log
        this.logService.addLog("Deleted worker "+worker.name+" "+worker.surname+" ["+worker.role+"]")
      }else{
        window.alert("Error with status code: " + this.statusCode)
      }
    }
  }

  // routing verso la pagina di modifica del lavotatore
  async editWorker(id: any) {
    sessionStorage.setItem('idWorker', id)
    this.router.navigate(['/home/workers/edit'])
  }

  reloadPage() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([this.router.url]);
  }

  // funzione per ottenere gli item per la precedente pagina da visualizzare
  async goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      this.workersArray = await this.workerService.getWorkersFromTo(startIndex + 1, startIndex + this.itemsPerPage);
      this.totalPages = false
    }
  }

  // funzione per ottenere gli item per la prossima pagina da visualizzare
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


  // funzioni per esportare gli elementi di dataArray in formato CSV
  
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
      this.logService.addLog("Workers list exported in CSV")
    }
  }


}
