import { Component } from '@angular/core';
import { Admin } from '../../models/admin';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';
import { WorkerService } from '../../services/worker.service';
import { LogService } from '../../services/log.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  admin:Admin = {} as Admin;
  worker:Worker = {} as Worker;

  statusCode: number = 0;

  btnDisabled: boolean = false;

  constructor(private adminService:AdminService, private workerService:WorkerService, private logService:LogService, private router: Router) {
  }

  // on init
  ngOnInit(){
    this.btnDisabled = false;
  }

  // on submit
  async onSubmit(form: any) {
    this.btnDisabled = true;

    // proviamo il login come ADMIN con le credenziali inserite
    this.statusCode = await this.adminService.loginAdmin(this.admin.email, this.admin.password);

    // se il login va a buon fine
    if (this.statusCode == 0){

      // aggiunta del log
      this.logService.addLog("Login ADMIN with email: "+this.admin.email)

      // routing verso la home
      this.router.navigate(['/home/branch'])
    }else{

      // proviamo il login come SECURIITY MANAGER con le credenziali inserite
      this.statusCode = await this.workerService.loginWorker(this.admin.email, this.admin.password);

      // se il login va a buon fine
      if (this.statusCode == 0){

        // aggiunta del log
        this.logService.addLog("Login SECURITY MANAGER with email: "+this.admin.email)

        // routing verso la home
        this.router.navigate(['/home/branch'])
      }
    }

    this.btnDisabled = false;
  }

}
