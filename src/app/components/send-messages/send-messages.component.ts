import { Component } from '@angular/core';
import { MqttService } from 'ngx-mqtt';
import { WorkerService } from '../../services/worker.service';
import { Worker } from '../../models/worker';
import { Router } from '@angular/router';

@Component({
  selector: 'app-send-messages',
  templateUrl: './send-messages.component.html',
  styleUrl: './send-messages.component.scss'
})
export class SendMessagesComponent {

  workers : Worker[] | null = [];
  checked_workers : Worker[] | null = [];

  messageText: string = '';

  constructor(private mqttService: MqttService, private workerService:WorkerService, private router: Router) {

  }

  //On init
  async ngOnInit() {
    this.workers = await this.workerService.getAll();
  }

  //On destroy
  ngOnDestroy() {
  }

  // Funzione che si attiva al cambio di stato di una checkbox
  toggleWorker(worker: Worker, event: any) {
    if (event.target.checked) {
      worker.checked = true;
      this.checked_workers?.push(worker)
    }else{
      worker.checked = false;
      this.checked_workers?.splice(this.checked_workers.indexOf(worker), 1);
    }
  }

  sendMessage(message: string, recipients: Worker[] | null){

    if(recipients){
      for(const recipient of recipients){
        this.mqttService.unsafePublish('/'+recipient.idHeadphones, message, { qos: 0, retain: false });
      }
    }
    this.reloadPage()
    
  }


  reloadPage() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([this.router.url]);
  }

}
