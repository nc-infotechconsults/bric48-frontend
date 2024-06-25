import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Admin } from '../../models/admin';
import { AdminService } from '../../services/admin.service';
import { MachineryBarComponent } from '../machinery-bar/machinery-bar.component';
import { MachineryService } from '../../services/machinery.service';
import { Machinery } from '../../models/machinery';
import { Worker } from '../../models/worker';
import { WorkerService } from '../../services/worker.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  @ViewChild(MachineryBarComponent) sidebar!: MachineryBarComponent;

  admin:Worker | Admin | null = {} as Worker | Admin | null;

  role = sessionStorage.getItem('role');

  isAdmin: boolean = true

  intervalId: any;

  constructor(private adminService:AdminService, private workerService:WorkerService, private router: Router) { }

  notificationCount: any;

  async ngOnInit(){

    if(this.role == 'ADMIN'){
      this.admin = await this.adminService.getAdminByEmail(sessionStorage.getItem('email'));
      this.isAdmin= true
    }else{
      this.admin = await this.workerService.getWorkerByEmail(sessionStorage.getItem('email'));
      this.isAdmin= false
    }

    this.notificationCount = Number(sessionStorage.getItem('alarms_length'))

    this.startPolling()
  }

  isHomePage(): boolean {
    return this.router.url === '/home/branch';
  }

  goToHomePage(): void {
    this.router.navigate(['/home/branch']);
  }

  goToHeadphonesList(): void {
    this.router.navigate(['/home/headphones']);
  }

  goToWorkersList(): void {
    this.router.navigate(['/home/workers']);
  }

  goToSensorsList(): void {
    this.router.navigate(['/home/sensors']);
  }

  goToMachineriesList(): void {
    this.router.navigate(['/home/machineries']);
  }

  goToBranchesList(): void {
    this.router.navigate(['/home/branches']);
  }

  goToMachineriesDataList(): void {
    this.router.navigate(['/home/data']);
  }

  goToSendMessages(): void{
    this.router.navigate(['/home/messages']);
  }

  goToAccount(): void{

    console.log(this.role)

    if(this.role == 'ADMIN'){
      this.router.navigate(['/home/account']);
    }else{
      sessionStorage.setItem('idWorker', this.admin?.id!)
      this.router.navigate(['/home/workers/edit'])
    }
    
  }

  logout(): void {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('email')
    sessionStorage.removeItem('role')
    this.router.navigate(['/']);
  }

  startPolling() {
    this.intervalId = setInterval(async () => {
      
      this.notificationCount = Number(sessionStorage.getItem('alarms_length'))
    
    }, 1000); // Esegui ogni secondo
  }

}
