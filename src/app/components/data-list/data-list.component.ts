import { Component } from '@angular/core';
import { MachineryData } from '../../models/machinery-data';
import { MachineryDataService } from '../../services/machinery-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-data-list',
  templateUrl: './data-list.component.html',
  styleUrl: './data-list.component.scss'
})
export class DataListComponent {

  dataArray: MachineryData[] | null = [];

  searchedMserial: string = ""
  searchedType: string = "all types"

  startDate: string = ""
  endDate: string = ""

  statusCode: number = 0;

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = false;

  constructor(private machineryDataService: MachineryDataService, private router: Router) {
  }

  //On init
  async ngOnInit() {
    this.dataArray = await this.machineryDataService.getDataFromTo(1, this.itemsPerPage);

    if(this.dataArray){
      if(this.dataArray.length < this.itemsPerPage){
        this.totalPages = true;
      }
    }
  }

  //On destroy
  ngOnDestroy() {
  }

  // Search
  async search() {

    if(this.compareDate(this.startDate, this.endDate) == 1){
      this.reloadPage()
      window.alert("Invalid data selection!");
    }
  
    this.dataArray = await this.machineryDataService.getAll();
  
    if(this.dataArray != null){
      this.dataArray = this.dataArray.filter(data => {
        let [timestamp, hour] = data.timestamp.split("+");
  
        if(this.searchedMserial != "" && !data.mserial.toLowerCase().includes(this.searchedMserial.toLowerCase())){
          return false;
        }
        if(this.searchedType != "all types" && !data.type.toLowerCase().includes(this.searchedType.toLowerCase())){
          return false;
        }
        if(this.startDate != "" && !(this.compareDate(timestamp, this.startDate) == 1 || this.compareDate(timestamp, this.startDate) == 0)){
          return false;
        }
        if(this.endDate != "" && !(this.compareDate(timestamp, this.endDate) == -1 || this.compareDate(timestamp, this.endDate) == 0)){
          return false;
        }
        return true;
      });
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
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      this.dataArray = await this.machineryDataService.getDataFromTo(startIndex, startIndex + this.itemsPerPage - 1);
      this.totalPages = false
    }
  }

  async goToNextPage() {
    if (!this.totalPages) {
      this.currentPage++;
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      this.dataArray = await this.machineryDataService.getDataFromTo(startIndex, startIndex + this.itemsPerPage - 1);

      if(this.dataArray){
        if(this.dataArray?.length < this.itemsPerPage){
          this.totalPages = true
        }
      }
    }
  }


}
