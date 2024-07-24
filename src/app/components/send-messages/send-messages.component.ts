import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { MqttService } from 'ngx-mqtt';
import { WorkerService } from '../../services/worker.service';
import { Worker } from '../../models/worker';
import { Router } from '@angular/router';
import { LogService } from '../../services/log.service';
import { Message } from '../../models/message';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-send-messages',
  templateUrl: './send-messages.component.html',
  styleUrl: './send-messages.component.scss'
})
export class SendMessagesComponent {

  workers : Worker[] | null = [];
  checked_workers : Worker[] | null = [];
  workers_from_machinery_details : Worker[] | null = [];

  messages : Message[] | null = [];

  number_checked_workers : number = 0

  messageText: string = '';

  searchedRoll: string = '';
  searchedRole: string = 'all roles';
  searchedName: string = '';
  searchedSurname: string = '';

  index : number = 0

  constructor(private mqttService: MqttService, private workerService:WorkerService, private messageService:MessageService, private logService:LogService, private router: Router) {

  }

  // on init
  async ngOnInit() {

    // ottenimento dei lavoratori
    this.workers = await this.workerService.getAll();

    // ottenimento dei messaggi
    this.messages = await this.messageService.getAll();

    // ottenimento dei lavoratori selezionati per l'invio dei messaggi
    const checked_workersJSON = sessionStorage.getItem('workers');
    sessionStorage.removeItem('workers');

    if (checked_workersJSON) {
      // analizza la stringa JSON per ottenere un array di oggetti Worker o un singolo oggetto Worker
      const workers_gotten: Worker[] | Worker = JSON.parse(checked_workersJSON);

      if (Array.isArray(workers_gotten)) { // se il JSON analizzato è un array allora il messaggio deve essere inviatto a più lavoratori

        if(this.workers != null){
          this.workers.forEach(worker => { // per ogni lavoratore
            // controlla se workers_gotten contiene un lavoratore con lo stesso id del lavoratore corrente
            if (workers_gotten.some(gottenWorker => gottenWorker.id === worker.id)) {
              worker.checked = true; // imposta l'attributo checked a true
              this.number_checked_workers = this.number_checked_workers + 1; // incrementa il conteggio dei lavoratori selezionati
              this.checked_workers?.push(worker); // aggiungi il lavoratore selezionato alla lista checked_workers
            }
          });
        }

      } else { // se il JSON analizzato non è un array il messaggio deve essere inviato ad un solo lavoratore

        if(this.workers != null){
          this.workers.forEach(worker => { // per ogni lavoratore
            if (worker.id === workers_gotten.id) { // controlla se l'id del lavoratore corrisponde all'id di workers_gotten
              worker.checked = true; // imposta l'attributo checked a true
              this.number_checked_workers = this.number_checked_workers + 1; // incrementa il conteggio dei lavoratori selezionati
              this.checked_workers?.push(worker); // aggiungi il lavoratore selezionato alla lista checked_workers
            }
          });
        }

      }

    }

  }

  // on destroy
  ngOnDestroy() {
  }

  // funzione che si attiva al cambio di stato di una checkbox
  toggleWorker(worker: Worker, event: any) {

    // se la checkbox del lavoratore viene selezionata
    if (event.target.checked) {
      worker.checked = true;

      // aggiunta del lavoratore nella lista checked_workers
      this.checked_workers?.push(worker)

      // incrementa il conteggio dei lavoratori selezionati
      this.number_checked_workers = this.number_checked_workers + 1
    }else{ // se la checkbox del lavoratore viene deselezionata
      worker.checked = false;

      if(this.checked_workers != null){
        // rimozione del lavoratore dalla lista checked_workers
        this.checked_workers = this.checked_workers.filter(data => data.id !== worker.id);
      }

      // decremento il conteggio dei lavoratori selezionati
      this.number_checked_workers = this.number_checked_workers - 1
    }

  }

  // funzione per l'invio del messaggio mqtt
  sendMessage(message: string){

    if (this.checked_workers != null) {
      // per ogni lavoratore selezionato
      for (const worker of this.checked_workers) {
        // publich del messaggio MQTT sul topic relativo al singolo lavoratore
        this.mqttService.unsafePublish('/' + worker.idHeadphones, message, { qos: 0, retain: false });
      }
      window.alert("Message sent!");
    
      // creazione di una lista di nomi e cognomi dei lavoratori
      const workerNames = this.checked_workers.map(worker => `${worker.name} ${worker.surname}`).join('-');
    
      // aggiunta del log
      this.logService.addLog("Message \""+message+"\" sent to " + workerNames);
    }
    
    // aggiorna la pagina
    this.reloadPage()
    
  }

  // routing verso la pagina di modifica dei messaggi
  goToManageMessages(){
    this.router.navigate(['/home/messages/edit']);
  }

  // funzione per salvare il messaggio dalla tendina
  handleSelectChange(event: any) {
    this.messageText = event.target.value;
  }

  reloadPage() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([this.router.url]);
  }

  // funzione per la ricerca
  async search(){

    // ottenimento dei lavoratori
    this.workers = await this.workerService.getAll();

    if(this.workers != null){
        this.workers.forEach(worker => {
          // controlla se checked_workers contiene un lavoratore con lo stesso id
          if(this.checked_workers != null){
            if (this.checked_workers.some(checkedWorker => checkedWorker.id === worker.id)) {
              worker.checked = true; // imposta l'attributo checked a true
            }
          }
        });
    }
  
    // applico i filtri selezionati alla lista dei lavoratori
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
