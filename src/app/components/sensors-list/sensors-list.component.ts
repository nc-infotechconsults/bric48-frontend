import { Component } from '@angular/core';
import { Sensor } from '../../models/sensor';
import { SensorService } from '../../services/sensor.service';
import { Router } from '@angular/router';
import { LogService } from '../../services/log.service';

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

  constructor(private sensorService:SensorService, private logService:LogService, private router: Router) {
  }

  // on init
  async ngOnInit() {

    // ottenimento dei primi itemsPerPage + 1 beacon
    this.sensorsArray = await this.sensorService.getSensorsFromTo(1, this.itemsPerPage + 1);

    // se il numero di beacon è <= al numero di item visualizzabili nella pagina, si imposta il flag totalPages a true
    // altrimenti si elimina l'undicesimo elemento dall'array che serve solo a vedere se esistono pagine successive a quella corrente
    if(this.sensorsArray){
      if(this.sensorsArray.length <= this.itemsPerPage){
        this.totalPages = true;
      }else{
        this.sensorsArray.pop();
      }
    }
  }

  // on destroy
  ngOnDestroy() {
  }

  // routing verso la pagina di aggiunta di un nuovo beacon
  goToNewSensorPage(): void {
    this.router.navigate(['/home/sensors/new']);
  }

  // eliminazione del beacon
  async deleteSensor(mac: any) {

    if (window.confirm('Are you sure you want to delete the sensor ' + mac + '?')) {

      // eliminazione del beacon se la scelta è stata confermata
      this.statusCode = await this.sensorService.deleteSensor(mac);

      if (this.statusCode == 0){

        // aggiorna la pagina
        this.reloadPage()
        window.alert("Sensor deleted!");

        // aggiunta del log
        this.logService.addLog("Deleted sensor with MAC: "+mac)
      }else{
        window.alert("Error with status code: " + this.statusCode)
      }
    }
  }

  // modifica del beacon
  async editSensor(mac: any) {
    sessionStorage.setItem('macSensor', mac)

    // routing verso la pagina di modifica del beacon
    this.router.navigate(['/home/sensors/edit'])
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
      this.sensorsArray = await this.sensorService.getSensorsFromTo(startIndex + 1, startIndex + this.itemsPerPage);
      this.totalPages = false
    }
  }

  // funzione per ottenere gli item per la prossima pagina da visualizzare
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
    if(this.sensorsArray){
      const csvData = this.convertToCSV(this.sensorsArray);
      this.downloadCSV(csvData, "Sensors_List");
      this.logService.addLog("Sensors list exported in CSV")
    }
  }

}
