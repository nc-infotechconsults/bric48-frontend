import { Component } from '@angular/core';
import { Log } from '../../models/log';
import { LogService } from '../../services/log.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-list',
  templateUrl: './log-list.component.html',
  styleUrl: './log-list.component.scss'
})
export class LogListComponent {

  logs: Log[] | null = [];

  logsFiltered: Log[] | null = [];

  searchedText: string = ""
  startDate: string = ""
  endDate: string = ""

  statusCode: number = 0;

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = false;

  constructor(private logService: LogService, private router: Router) {
  }

  //On init
  async ngOnInit() {
    this.logs = await this.logService.getLogsFromTo(1, this.itemsPerPage + 1, this.searchedText, this.startDate, this.endDate);

    if(this.logs){
      if(this.logs.length <= this.itemsPerPage){
        this.totalPages = true;
      }else{
        this.logs.pop();
      }
    }
  }

  //On destroy
  ngOnDestroy() {
  }

  // Search
  async search() {

    this.currentPage = 1;
    this.totalPages = false;

    if(this.compareDate(this.startDate, this.endDate) == 1){
      this.reloadPage()
      window.alert("Invalid data selection!");
    }
  
    this.logs = await this.logService.getLogsFromTo(1, this.itemsPerPage + 1, this.searchedText, this.startDate, this.endDate);
    
    if(this.logs){
      if(this.logs.length <= this.itemsPerPage){
        this.totalPages = true;
      }else{
        this.logs.pop();
      }
    }
  }

  compareDate(firstDate: string, secondDate: string): number {
    // Converti le date in formato 'gg/mm/aaaa' in oggetti Date
    let [year1, month1, day1] = firstDate.split("-");
    let [year2, month2, day2] = secondDate.split("-");
    let date1 = new Date(Number(year1), Number(month1) - 1, Number(day1));
    let date2 = new Date(Number(year2), Number(month2) - 1, Number(day2));

    // Confronta le due date
    if (date1 > date2) {
        return 1;
    } else if (date1 < date2){
        return -1;
    } else {
      return 0;
    }
  }

  reloadPage() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([this.router.url]);
  }


  async goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      let startIndex = (this.currentPage - 1) * this.itemsPerPage;
      this.logs = await this.logService.getLogsFromTo(startIndex + 1, startIndex + this.itemsPerPage, this.searchedText, this.startDate, this.endDate);
      this.totalPages = false
    }
  }

  async goToNextPage() {
    if (!this.totalPages) {
      this.currentPage++;
      let startIndex = (this.currentPage - 1) * this.itemsPerPage;

      this.logs = await this.logService.getLogsFromTo(startIndex + 1, startIndex + this.itemsPerPage + 1, this.searchedText, this.startDate, this.endDate);

      if(this.logs){
        if(this.logs?.length <= this.itemsPerPage){
          this.totalPages = true
        }else{
          this.logs.pop();
        }
      }
    }
  }


  // Funzioni per esportare gli elementi di logs in formato CSV
  
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
    this.logsFiltered = await this.logService.getLogsFiltered(this.searchedText, this.startDate, this.endDate);
    if(this.logsFiltered){
      const csvData = this.convertToCSV(this.logsFiltered);
      this.downloadCSV(csvData, "Logs");
      this.logService.addLog("Logs list exported in CSV")
    }
  }

}
