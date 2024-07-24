import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';
import { Admin } from '../../models/admin';
import { WorkerService } from '../../services/worker.service';
import { LogService } from '../../services/log.service';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrl: './edit-account.component.scss'
})
export class EditAccountComponent {

  // email di chi ha fatto il login
  email: any = sessionStorage.getItem('email');

  // ruolo di chi ha fatto il login
  role = sessionStorage.getItem('role');

  admin: any = {} as any;

  statusCode: number = 0;

  btnDisabled: boolean = false;

  constructor(private adminService:AdminService, private logService:LogService, private router: Router) {
  }

  // on init
  async ngOnInit() {
    this.btnDisabled = false;

    // ottenimento dell'admin
    this.admin = await this.adminService.getAdminByEmail(this.email);
  }

  // on submit
  async onSubmit(form: any) {
    this.btnDisabled = true;

    // modifica dell'admin
    this.statusCode = await this.adminService.editAdmin(this.admin);

    if (this.statusCode == 0){
      window.alert("Account edited!");

      // aggiunta del log
      this.logService.addLog("Edited account of "+this.role+" with email: "+this.admin?.email)

      // routing verso la pagina di visualizzazione dei branch
      this.router.navigate(['/home/branch'])
    }

    this.btnDisabled = false;
  }

}
