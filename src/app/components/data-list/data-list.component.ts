import { Component } from '@angular/core';
import { MachineryData } from '../../models/machinery-data';
import { MachineryDataService } from '../../services/machinery-data.service';
import { Router } from '@angular/router';
import { LogService } from '../../services/log.service';

@Component({
  selector: 'app-data-list',
  templateUrl: './data-list.component.html',
  styleUrl: './data-list.component.scss'
})
export class DataListComponent {

  dataArray: MachineryData[] | null = [];

  dataArrayFiltered: MachineryData[] | null = [];

  searchedMserial: string = ""
  searchedType: string = "all types"
  startDate: string = ""
  endDate: string = ""

  statusCode: number = 0;

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = false;

  constructor(private machineryDataService: MachineryDataService, private logService:LogService, private router: Router) {
  }

  // on init
  async ngOnInit() {

    // ottenimento dei primi itemsPerPage + 1 dati dai macchinari
    this.dataArray = await this.machineryDataService.getDataFromTo(1, this.itemsPerPage + 1, this.searchedMserial, this.searchedType, this.startDate, this.endDate);
    
    // se il numero di dati è <= al numero di item visualizzabili nella pagina, si imposta il flag totalPages a true
    // altrimenti si elimina l'undicesimo elemento dall'array che serve solo a vedere se esistono pagine successive a quella corrente
    if(this.dataArray){
      if(this.dataArray.length <= this.itemsPerPage){
        this.totalPages = true;
      }else{
        this.dataArray.pop();
      }
    }
  }

  // on destroy
  ngOnDestroy() {
  }

  // funzione per la ricerca
  async search() {

    this.currentPage = 1;
    this.totalPages = false;

    // se le date inserite non sono valide
    if(this.compareDate(this.startDate, this.endDate) == 1){
      // ricarica la pagina
      this.reloadPage()
      window.alert("Invalid data selection!");
    }
    
    // ottenimento dei dati filtrati
    this.dataArray = await this.machineryDataService.getDataFromTo(1, this.itemsPerPage + 1, this.searchedMserial, this.searchedType, this.startDate, this.endDate);
    
    if(this.dataArray){
      if(this.dataArray.length <= this.itemsPerPage){
        this.totalPages = true;
      }else{
        this.dataArray.pop();
      }
    }
  }

  // funzione per confrontare due date
  compareDate(firstDate: string, secondDate: string): number {
    // Converti le date in formato 'gg/mm/aaaa' in oggetti Date
    let [year1, month1, day1] = firstDate.split("-");
    let [year2, month2, day2] = secondDate.split("-");
    let date1 = new Date(Number(year1), Number(month1) - 1, Number(day1));
    let date2 = new Date(Number(year2), Number(month2) - 1, Number(day2));

    if (date1 > date2) {
        return 1; // se la prima data è successiva alla seconda
    } else if (date1 < date2){
        return -1; // se la prima data è precedente alla prima
    } else {
      return 0; // se le date sono uguali
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
      let startIndex = (this.currentPage - 1) * this.itemsPerPage;
      this.dataArray = await this.machineryDataService.getDataFromTo(startIndex + 1, startIndex + this.itemsPerPage, this.searchedMserial, this.searchedType, this.startDate, this.endDate);
      this.totalPages = false
    }
  }

  // funzione per ottenere gli item per la prossima pagina da visualizzare
  async goToNextPage() {
    if (!this.totalPages) {
      this.currentPage++;
      let startIndex = (this.currentPage - 1) * this.itemsPerPage;

      this.dataArray = await this.machineryDataService.getDataFromTo(startIndex + 1, startIndex + this.itemsPerPage + 1, this.searchedMserial, this.searchedType, this.startDate, this.endDate);

      if(this.dataArray){
        if(this.dataArray?.length <= this.itemsPerPage){
          this.totalPages = true
        }else{
          this.dataArray.pop();
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
    this.dataArrayFiltered = await this.machineryDataService.getDataFiltered(this.searchedMserial, this.searchedType, this.startDate, this.endDate);
    if(this.dataArrayFiltered){
      const csvData = this.convertToCSV(this.dataArrayFiltered);
      this.downloadCSV(csvData, "Machinery_Data");
      this.logService.addLog("Machinery data exported in CSV")
    }
  }


}
