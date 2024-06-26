import { Component } from '@angular/core';
import { WorkerService } from '../../services/worker.service';
import { Router } from '@angular/router';
import { Worker } from '../../models/worker';
import { Headphones } from '../../models/headphones';
import { HeadphonesService } from '../../services/headphones.service';
import { LogService } from '../../services/log.service';

@Component({
  selector: 'app-new-worker',
  templateUrl: './new-worker.component.html',
  styleUrl: './new-worker.component.scss'
})
export class NewWorkerComponent {

  worker:Worker = {} as Worker;

  headphonesArray: Headphones[] | null = [];

  statusCode: number = 0;

  btnDisabled: boolean = false;

  constructor(private workerService:WorkerService, private headphonesService:HeadphonesService, private logService:LogService, private router: Router) {
  }

  async ngOnInit(){
    this.worker.password = ""
    this.btnDisabled = false;
    this.headphonesArray = await this.headphonesService.getByIsAssociated("False");
  }

  async onSubmit(form: any) {
    this.btnDisabled = true;

    let existingWorkerEmail:Worker | null = {} as Worker | null;
    existingWorkerEmail = await this.workerService.getWorkerByEmail(this.worker.email)

    let existingWorkerRollNumber:Worker | null = {} as Worker | null;
    existingWorkerRollNumber = await this.workerService.getWorkerByRollNumber(this.worker.rollNumber)

    if(existingWorkerEmail?.id != null){
      window.alert("A worker with this email already exists!");
    }else if(existingWorkerRollNumber?.id != null){
      window.alert("A worker with this roll number already exists!");
    }else{
      if(this.worker.idHeadphones == "No headphones associated"){
        this.worker.idHeadphones = ""
      }

      if(this.worker.role != "Security Manager"){
        this.worker.password = ""
      }
  
      this.statusCode = await this.workerService.addWorker(this.worker);
  
      if (this.statusCode == 0){
        window.alert("New worker added!");
        this.logService.addLog("Added worker "+this.worker.name+" "+this.worker.surname+" ["+this.worker.role+"]")
        this.router.navigate(['/home/workers'])
      }
    }

    this.btnDisabled = false;
  }

}
