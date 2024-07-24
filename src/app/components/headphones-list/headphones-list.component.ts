import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeadphonesService } from '../../services/headphones.service';
import { Headphones } from '../../models/headphones';
import { WorkerService } from '../../services/worker.service';
import { LogService } from '../../services/log.service';

@Component({
  selector: 'app-headphones-list',
  templateUrl: './headphones-list.component.html',
  styleUrl: './headphones-list.component.scss'
})
export class HeadphonesListComponent {

  headphonesArray: Headphones[] | null = [];
  statusCode: number = 0;

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = false;

  constructor(private headphonesService:HeadphonesService, private workerService:WorkerService, private logService:LogService, private router: Router) {
  }

  // on init
  async ngOnInit() {

    // ottenimento delle prime itemsPerPage + 1 cuffie
    this.headphonesArray = await this.headphonesService.getHeadphonesFromTo(1, this.itemsPerPage + 1);

    // se il numero di cuffie è <= al numero di item visualizzabili nella pagina, si imposta il flag totalPages a true
    // altrimenti si elimina l'undicesimo elemento dall'array che serve solo a vedere se esistono pagine successive a quella corrente
    if(this.headphonesArray){
      if(this.headphonesArray.length <= this.itemsPerPage){
        this.totalPages = true;
      }else{
        this.headphonesArray.pop();
      }
    }
  }

  // on destroy
  ngOnDestroy() {
  }

  // routing verso la pagina di aggiunta di una nuova cuffia
  goToNewHeadphonesPage(): void {
    this.router.navigate(['/home/headphones/new']);
  }

  // eliminazione di una cuffia
  async deleteHeadphones(serial: string) {

    if (window.confirm('Are you sure you want to delete the headphones ' + serial + '?')) {

      // eliminazione della cuffia se si conferma la scelta
      this.statusCode = await this.headphonesService.deleteHeadphones(serial);

      if (this.statusCode == 0){

        // aggiornna il campo idHeadphones del lavoratore impostandolo a stringa vuota
        this.statusCode = await this.workerService.updateIdHeadphones(serial, "");

        if (this.statusCode == 0){
          window.alert("Headphones deleted!");

          // aggiunta del log
          this.logService.addLog("Deleted headphones with serial: "+serial)

          // aggiorna la pagina
          this.reloadPage()
        }else{
          window.alert("Error with status code: " + this.statusCode)
        }

      }else{
        window.alert("Error with status code: " + this.statusCode)
      }

    }
    
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
      this.headphonesArray = await this.headphonesService.getHeadphonesFromTo(startIndex + 1, startIndex + this.itemsPerPage);
      this.totalPages = false
    }
  }

  // funzione per ottenere gli item per la prossima pagina da visualizzare
  async goToNextPage() {
    if (!this.totalPages) {
      this.currentPage++;
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      this.headphonesArray = await this.headphonesService.getHeadphonesFromTo(startIndex + 1, startIndex + this.itemsPerPage + 1);

      if(this.headphonesArray){
        if(this.headphonesArray?.length <= this.itemsPerPage){
          this.totalPages = true
        }else{
          this.headphonesArray.pop();
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
    if(this.headphonesArray){
      const csvData = this.convertToCSV(this.headphonesArray);
      this.downloadCSV(csvData, "Headphones_List");
      this.logService.addLog("Headphones list exported in CSV")
    }
  }


}
