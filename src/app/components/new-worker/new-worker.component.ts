import { Component } from '@angular/core';
import { WorkerService } from '../../services/worker.service';
import { Router } from '@angular/router';
import { Worker } from '../../models/worker';
import { Headphones } from '../../models/headphones';
import { HeadphonesService } from '../../services/headphones.service';

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

  constructor(private workerService:WorkerService, private headphonesService:HeadphonesService, private router: Router) {
  }

  async ngOnInit(){
    this.btnDisabled = false;
    this.headphonesArray = await this.headphonesService.getByIsAssociated("False");
  }

  async onSubmit(form: any) {
    this.btnDisabled = true;

    if(this.worker.idHeadphones == "No headphones associated"){
      this.worker.idHeadphones = ""
    }

    this.statusCode = await this.workerService.addWorker(this.worker);

    if (this.statusCode == 0){
      window.alert("New worker added!");
      this.router.navigate(['/home/workers'])
    }

    this.btnDisabled = false;
  }

}
