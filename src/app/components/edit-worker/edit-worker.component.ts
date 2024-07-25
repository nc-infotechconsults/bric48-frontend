import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WorkerService } from '../../services/worker.service';
import { Worker } from '../../models/worker';
import { HeadphonesService } from '../../services/headphones.service';
import { Headphones } from '../../models/headphones';
import { PathLocationStrategy } from '@angular/common';
import { LogService } from '../../services/log.service';

@Component({
  selector: 'app-edit-worker',
  templateUrl: './edit-worker.component.html',
  styleUrl: './edit-worker.component.scss'
})
export class EditWorkerComponent {

  worker:any = {} as any;

  oldIdHeadphones: string = ""
  oldRole: string = ""

  headphonesArray: Headphones[] | null = [];

  // id del lavoratore che vogliamo modificare
  idWorker: any = sessionStorage.getItem('idWorker');

  statusCode: number = 0;

  btnDisabled: boolean = false;
  isAdmin: boolean = false;

  constructor(private workerService:WorkerService, private headphonesService:HeadphonesService, private logService:LogService, private router: Router) {
  }

  // on init
  async ngOnInit() {

    if(sessionStorage.getItem('role') == 'ADMIN'){
      this.isAdmin = true;
    }

    this.btnDisabled = false;

    // ottenimento del lavoratore
    this.worker = await this.workerService.getWorkerById(this.idWorker);
    
    // vecchio ruolo del lavoratore
    this.oldRole = this.worker.role

    // imposto il campo password a stringa vuota
    this.worker.password = ""

    // vecchie cuffie del lavoratore
    this.oldIdHeadphones = this.worker.idHeadphones;
    
    // ottenimento delle cuffie non ancora associate ad un lavoratore
    this.headphonesArray = await this.headphonesService.getByIsAssociated("False");
  }

  // on submit
  async onSubmit(form: any) {
    this.btnDisabled = true;

    // se si seleziona dal menu a tendina "No headphones associated", si imposta il campo idHeadphones del lavoratore a stringa vuota
    if(this.worker.idHeadphones == "No headphones associated"){
      this.worker.idHeadphones = ""
    }

    this.worker.id = this.idWorker;

    // un lavoratore che NON è security manager, non ha la password
    if(this.worker.role != "Security Manager"){
      this.worker.password = ""
    }

    // modifica del lavoratore
    this.statusCode = await this.workerService.editWorker(this.oldIdHeadphones, this.worker);

    if (this.statusCode == 0){
      
      // se è l'ADMIN a modificare il lavoratore
      if(sessionStorage.getItem('role') == 'ADMIN'){
        window.alert("Worker edited!");

        // aggiunta del log
        this.logService.addLog("Edited worker "+this.worker.name+" "+this.worker.surname+" ["+this.worker.role+"]")

        // routing verso la pagina di visualizzazione dei worker
        this.router.navigate(['/home/workers'])

      }else{ // se è il security manager a modificare il suo profilo
        window.alert("Account edited!");

        // aggiunta del log
        this.logService.addLog("Edited account of "+this.worker.role+" with email: "+this.worker.email)

        // routing verso la pagina di visualizzazione dei branch
        this.router.navigate(['/home/branch'])
      }
      
    }

    this.btnDisabled = false;
  }



}
