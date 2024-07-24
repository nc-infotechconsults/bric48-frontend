import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Admin } from '../../models/admin';
import { AdminService } from '../../services/admin.service';
import { MachineryBarComponent } from '../machinery-bar/machinery-bar.component';
import { MachineryService } from '../../services/machinery.service';
import { Machinery } from '../../models/machinery';
import { Worker } from '../../models/worker';
import { WorkerService } from '../../services/worker.service';
import { LogService } from '../../services/log.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  @ViewChild(MachineryBarComponent) sidebar!: MachineryBarComponent;

  admin:Worker | Admin | null = {} as Worker | Admin | null;

  // ruolo di chi ha fatto il login
  role = sessionStorage.getItem('role');

  isAdmin: boolean = true

  intervalId: any;

  constructor(private adminService:AdminService, private workerService:WorkerService, private logService:LogService, private router: Router) { }

  notificationCount: any;

  // on init
  async ngOnInit(){

    // ottenimento dell'Admin o del Security Manager
    if(this.role == 'ADMIN'){
      this.admin = await this.adminService.getAdminByEmail(sessionStorage.getItem('email'));
      this.isAdmin= true
    }else{
      this.admin = await this.workerService.getWorkerByEmail(sessionStorage.getItem('email'));
      this.isAdmin= false
    }

    // ottenimento del numero di macchinari in allarme
    this.notificationCount = Number(sessionStorage.getItem('alarms_length'))

    // inizio del polling
    this.startPolling()
  }

  // se siamo sulla home pagina non attiviamo il routing
  isHomePage(): boolean {
    return this.router.url === '/home/branch';
  }

  // routing verso la home
  goToHomePage(): void {
    this.router.navigate(['/home/branch']);
  }

  // routing verso la pagina di visualizzazione dei sensori
  goToHeadphonesList(): void {
    this.router.navigate(['/home/headphones']);
  }

  // routing verso la pagina di visualizzazione dei lavoratori
  goToWorkersList(): void {
    this.router.navigate(['/home/workers']);
  }

  // routing verso la pagina di visualizzazione del branch
  goToSensorsList(): void {
    this.router.navigate(['/home/sensors']);
  }

  // routing verso la pagina di visualizzazione dei macchinari
  goToMachineriesList(): void {
    this.router.navigate(['/home/machineries']);
  }

  // routing verso la pagina di visualizzazione dei branch
  goToBranchesList(): void {
    this.router.navigate(['/home/branches']);
  }

  // routing verso la pagina di visualizzazione dei dati dei macchinari
  goToMachineriesDataList(): void {
    this.router.navigate(['/home/data']);
  }

  // routing verso la pagina di invio dei messaggi
  goToSendMessages(): void{
    this.router.navigate(['/home/messages']);
  }

  // routing verso la pagina di visualizzazione dei log
  goToCheckLogs(): void{
    this.router.navigate(['/home/logs']);
  }

  // routing verso la pagina di modifica account
  goToAccount(): void{

    if(this.role == 'ADMIN'){
      this.router.navigate(['/home/account']);
    }else{
      sessionStorage.setItem('idWorker', this.admin?.id!)
      this.router.navigate(['/home/workers/edit'])
    }
    
  }

  // funzione per eseguire il logout
  logout(): void {

    // aggiunta del log
    this.logService.addLog("Logout "+this.role+" with email: "+this.admin?.email)

    // eliminazione di tutte le variabili nel session storage
    sessionStorage.clear();

    // routing verso la pagina di login
    this.router.navigate(['/']);
  }

  // polling
  startPolling() {
    this.intervalId = setInterval(async () => {
      
      // ottenimento del numero di macchinari in allarme
      this.notificationCount = Number(sessionStorage.getItem('alarms_length'))
    
    }, 1000); // Esegui ogni secondo
  }

}
