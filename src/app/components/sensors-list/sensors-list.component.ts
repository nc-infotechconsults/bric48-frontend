import { Component } from '@angular/core';
import { Sensor } from '../../models/sensor';
import { SensorService } from '../../services/sensor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sensors-list',
  templateUrl: './sensors-list.component.html',
  styleUrl: './sensors-list.component.scss'
})
export class SensorsListComponent {

  sensorsArray: Sensor[] | null = [];
  statusCode: number = 0;

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = false;

  constructor(private sensorService:SensorService, private router: Router) {
  }

  //On init
  async ngOnInit() {
    this.sensorsArray = await this.sensorService.getSensorsFromTo(1, this.itemsPerPage + 1);

    if(this.sensorsArray){
      if(this.sensorsArray.length <= this.itemsPerPage){
        this.totalPages = true;
      }else{
        this.sensorsArray.pop();
      }
    }
  }

  //On destroy
  ngOnDestroy() {
  }

  goToNewSensorPage(): void {
    this.router.navigate(['/home/sensors/new']);
  }

  // Delete sensor by mac
  async deleteSensor(mac: any) {

    if (window.confirm('Are you sure you want to delete the sensor ' + mac + '?')) {
      this.statusCode = await this.sensorService.deleteSensor(mac);

      if (this.statusCode == 0){
        this.reloadPage()
        window.alert("Sensor deleted!");
      }else{
        window.alert("Error with status code: " + this.statusCode)
      }
    }
  }

  // Edit sensor by mac
  async editSensor(mac: any) {
    sessionStorage.setItem('macSensor', mac)
    this.router.navigate(['/home/sensors/edit'])
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
      this.sensorsArray = await this.sensorService.getSensorsFromTo(startIndex + 1, startIndex + this.itemsPerPage);
      this.totalPages = false
    }
  }

  async goToNextPage() {
    if (!this.totalPages) {
      this.currentPage++;
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      this.sensorsArray = await this.sensorService.getSensorsFromTo(startIndex + 1, startIndex + this.itemsPerPage + 1);

      if(this.sensorsArray){
        if(this.sensorsArray?.length < this.itemsPerPage){
          this.totalPages = true
        }else{
          this.sensorsArray.pop();
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
    if(this.sensorsArray){
      const csvData = this.convertToCSV(this.sensorsArray);
      this.downloadCSV(csvData, "Sensors_List");
    }
  }

}
