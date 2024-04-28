import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WorkerService } from '../../services/worker.service';
import { Worker } from '../../models/worker';
import { HeadphonesService } from '../../services/headphones.service';
import { Headphones } from '../../models/headphones';

@Component({
  selector: 'app-edit-worker',
  templateUrl: './edit-worker.component.html',
  styleUrl: './edit-worker.component.scss'
})
export class EditWorkerComponent {

  worker:any = {} as any;
  headphonesArray: Headphones[] | null = [];

  idWorker: any = localStorage.getItem('idWorker');

  statusCode: number = 0;

  btnDisabled: boolean = false;

  constructor(private workerService:WorkerService, private headphonesService:HeadphonesService, private router: Router) {
  }

  //On init
  async ngOnInit() {
    this.btnDisabled = false;
    this.worker = await this.workerService.getWorkerById(this.idWorker);
    this.headphonesArray = await this.headphonesService.getByIsAssociated("False");
  }

  async onSubmit(form: any) {
    this.btnDisabled = true;

    this.worker.id = this.idWorker;
    this.statusCode = await this.workerService.editWorker(this.worker);

    if (this.statusCode == 0){
      window.alert("Worker edited!");
      this.router.navigate(['/home/workers'])
    }

    this.btnDisabled = false;
  }



}
