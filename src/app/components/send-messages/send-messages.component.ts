import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { MqttService } from 'ngx-mqtt';
import { WorkerService } from '../../services/worker.service';
import { Worker } from '../../models/worker';
import { Router } from '@angular/router';
import { LogService } from '../../services/log.service';

@Component({
  selector: 'app-send-messages',
  templateUrl: './send-messages.component.html',
  styleUrl: './send-messages.component.scss'
})
export class SendMessagesComponent {

  workers : Worker[] | null = [];
  checked_workers : Worker[] | null = [];
  workers_from_machinery_details : Worker[] | null = [];

  number_checked_workers : number = 0

  messageText: string = '';

  searchedRoll: string = '';
  searchedRole: string = 'all roles';
  searchedName: string = '';
  searchedSurname: string = '';

  index : number = 0

  constructor(private mqttService: MqttService, private workerService:WorkerService, private logService:LogService, private router: Router) {

  }

  //On init
  async ngOnInit() {

    this.workers = await this.workerService.getAll();

    const checked_workersJSON = sessionStorage.getItem('workers');
    sessionStorage.removeItem('workers');

    if (checked_workersJSON) {
      const workers_gotten: Worker[] | Worker = JSON.parse(checked_workersJSON);

      if (Array.isArray(workers_gotten)) {

        if(this.workers != null){
          this.workers.forEach(worker => {
            // Controlla se workers_gotten contiene un worker con lo stesso id
            if (workers_gotten.some(gottenWorker => gottenWorker.id === worker.id)) {
              worker.checked = true; // Imposta l'attributo checked a true
              this.number_checked_workers = this.number_checked_workers + 1
              this.checked_workers?.push(worker)
            }
          });
        }

      } else {

        if(this.workers != null){
          this.workers.forEach(worker => {
            if (worker.id === workers_gotten.id) {
              worker.checked = true; // Imposta l'attributo checked a true
              this.number_checked_workers = this.number_checked_workers + 1
              this.checked_workers?.push(worker)
            }
          });
        }

      }
    
    }

  }

  //On destroy
  ngOnDestroy() {
  }

  // Funzione che si attiva al cambio di stato di una checkbox
  toggleWorker(worker: Worker, event: any) {
    if (event.target.checked) {
      worker.checked = true;
      this.checked_workers?.push(worker)
      this.number_checked_workers = this.number_checked_workers + 1
    }else{
      worker.checked = false;

      //this.checked_workers?.splice(this.checked_workers.indexOf(worker),1)
      if(this.checked_workers != null){
        this.checked_workers = this.checked_workers.filter(data => data.id !== worker.id);
      }

      this.number_checked_workers = this.number_checked_workers - 1
    }

  }

  // Invio del messaggio mqtt
  sendMessage(message: string){

    if (this.checked_workers != null) {
      for (const worker of this.checked_workers) {
        this.mqttService.unsafePublish('/' + worker.idHeadphones, message, { qos: 0, retain: false });
      }
      window.alert("Message sent!");
    
      // Creare una lista di nomi e cognomi dei worker
      const workerNames = this.checked_workers.map(worker => `${worker.name} ${worker.surname}`).join('-');
    
      // Aggiungere la lista alla stringa di log
      this.logService.addLog("Message \""+message+"\" sent to " + workerNames);
    }
    
    this.reloadPage()
    
  }

  // Salvo il messaggio dalla tendina
  handleSelectChange(event: any) {
    this.messageText = event.target.value;
  }


  reloadPage() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([this.router.url]);
  }

  // Filters
  async search(){

    this.workers = await this.workerService.getAll();

    if(this.workers != null){
        this.workers.forEach(worker => {
          // Controlla se checked_workers contiene un worker con lo stesso id
          if(this.checked_workers != null){
            if (this.checked_workers.some(checkedWorker => checkedWorker.id === worker.id)) {
              worker.checked = true; // Imposta l'attributo checked a true
            }
          }
        });
    }
  
  
    if(this.workers != null){
      this.workers = this.workers.filter(worker => {
        if(this.searchedRoll != "" && !worker.rollNumber.toLowerCase().includes(this.searchedRoll.toLowerCase())){
          return false;
        }
        if(this.searchedName != "" && !worker.name.toLowerCase().includes(this.searchedName.toLowerCase())){
          return false;
        }
        if(this.searchedSurname != "" && !worker.surname.toLowerCase().includes(this.searchedSurname.toLowerCase())){
          return false;
        }
        if(this.searchedRole != "all roles" && !worker.role.toLowerCase().includes(this.searchedRole.toLowerCase())){
          return false;
        }
        return true;
      });
    }

  }


}
