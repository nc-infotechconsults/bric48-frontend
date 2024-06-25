import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WorkerService } from '../../services/worker.service';
import { Worker } from '../../models/worker';
import { HeadphonesService } from '../../services/headphones.service';
import { Headphones } from '../../models/headphones';
import { PathLocationStrategy } from '@angular/common';

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

  idWorker: any = sessionStorage.getItem('idWorker');

  statusCode: number = 0;

  btnDisabled: boolean = false;
  isAdmin: boolean = false;

  constructor(private workerService:WorkerService, private headphonesService:HeadphonesService, private router: Router) {
  }

  //On init
  async ngOnInit() {

    if(sessionStorage.getItem('role') == 'ADMIN'){
      this.isAdmin = true;
    }
    
    this.btnDisabled = false;

    this.worker = await this.workerService.getWorkerById(this.idWorker);
    this.oldRole = this.worker.role
    this.worker.password = ""

    this.oldIdHeadphones = this.worker.idHeadphones;

    this.headphonesArray = await this.headphonesService.getByIsAssociated("False");
  }

  async onSubmit(form: any) {
    this.btnDisabled = true;

    if(this.worker.idHeadphones == "No headphones associated"){
      this.worker.idHeadphones = ""
    }

    this.worker.id = this.idWorker;


    if(this.worker.role != "Security Manager"){
      this.worker.password = ""
    }

    this.statusCode = await this.workerService.editWorker(this.oldIdHeadphones, this.worker);

    if (this.statusCode == 0){

      if(sessionStorage.getItem('role') == 'ADMIN'){
        window.alert("Worker edited!");
        this.router.navigate(['/home/workers'])
      }else{
        window.alert("Account edited!");
        this.router.navigate(['/home/branch'])
      }
      
    }

    this.btnDisabled = false;
  }



}
