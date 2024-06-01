import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Admin } from '../../models/admin';
import { AdminService } from '../../services/admin.service';
import { MachineryBarComponent } from '../machinery-bar/machinery-bar.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  @ViewChild(MachineryBarComponent) sidebar!: MachineryBarComponent;

  admin:Admin | null = {} as Admin | null;

  role: string = "ADMIN";

  constructor(private adminService:AdminService, private router: Router) { }

  async ngOnInit(){
    this.admin = await this.adminService.getAdminByEmail(sessionStorage.getItem('email'));
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
    this.router.navigate(['/home/account']);
  }

  logout(): void {
    sessionStorage.setItem('token', "")
    sessionStorage.setItem('email', "")
    this.router.navigate(['/']);
  }

}
