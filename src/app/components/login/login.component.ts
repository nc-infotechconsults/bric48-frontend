import { Component } from '@angular/core';
import { Admin } from '../../models/admin';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  admin:Admin = {} as Admin;

  statusCode: number = 0;

  btnDisabled: boolean = false;

  constructor(private adminService:AdminService, private router: Router) {
  }

  ngOnInit(){
    this.btnDisabled = false;
  }

  async onSubmit(form: any) {
    this.btnDisabled = true;

    this.statusCode = await this.adminService.loginAdmin(this.admin.email, this.admin.password);

    if (this.statusCode == 0){
      this.router.navigate(['/home/branch'])
    }

    this.btnDisabled = false;
  }

}
