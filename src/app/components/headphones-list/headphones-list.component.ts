import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeadphonesService } from '../../services/headphones.service';
import { Headphones } from '../../models/headphones';

@Component({
  selector: 'app-headphones-list',
  templateUrl: './headphones-list.component.html',
  styleUrl: './headphones-list.component.scss'
})
export class HeadphonesListComponent {

  headphonesArray: Headphones[] | null = [];
  statusCode: number = 0;

  constructor(private headphonesService:HeadphonesService, private router: Router) {
  }

  //On init
  async ngOnInit() {
    this.headphonesArray = await this.headphonesService.getAll();
  }

  //On destroy
  ngOnDestroy() {
  }

  goToNewHeadphonesPage(): void {
    this.router.navigate(['/home/headphones/new']);
  }

  // Delete headphones by serial
  async deleteHeadphones(serial: string) {
    this.statusCode = await this.headphonesService.deleteHeadphones(serial);

    if (this.statusCode == 0){
      window.alert("Headphones deleted!");
      //this.router.navigate(['/home/headphones'])
      this.reloadPage()
    }else{
      window.alert("Error with status code: " + this.statusCode)
    }
  }

  reloadPage() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([this.router.url]);
  }


}
