import { Component } from '@angular/core';
import { Headphones } from '../../models/headphones';
import { HeadphonesService } from '../../services/headphones.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-headphones',
  templateUrl: './new-headphones.component.html',
  styleUrl: './new-headphones.component.scss'
})
export class NewHeadphonesComponent {

  headphones:Headphones = {} as Headphones;

  statusCode: number = 0;

  btnDisabled: boolean = false;

  constructor(private headphonesService:HeadphonesService, private router: Router) {
  }

  ngOnInit(){
    this.btnDisabled = false;
  }

  async onSubmit(form: any) {
    this.btnDisabled = true;

    this.statusCode = await this.headphonesService.addHeadphones(this.headphones);

    if (this.statusCode == 0){
      window.alert("New headphones added!");
      this.router.navigate(['/home/headphones'])
    }

    this.btnDisabled = false;
  }

}
