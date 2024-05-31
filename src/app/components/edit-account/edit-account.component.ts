import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';
import { Admin } from '../../models/admin';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrl: './edit-account.component.scss'
})
export class EditAccountComponent {

  email: any = localStorage.getItem('email');

  admin: any = {} as any;

  statusCode: number = 0;

  btnDisabled: boolean = false;

  constructor(private admiService:AdminService, private router: Router) {
  }

  //On init
  async ngOnInit() {
    this.btnDisabled = false;
    this.admin = await this.admiService.getAdminByEmail(this.email);
  }

  async onSubmit(form: any) {
    this.btnDisabled = true;

    this.statusCode = await this.admiService.editAdmin(this.admin);

    if (this.statusCode == 0){
      window.alert("Account edited!");
      this.router.navigate(['/home/branch'])
    }

    this.btnDisabled = false;
  }

}
