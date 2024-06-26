import { Component } from '@angular/core';
import { Headphones } from '../../models/headphones';
import { HeadphonesService } from '../../services/headphones.service';
import { Router } from '@angular/router';
import { LogService } from '../../services/log.service';

@Component({
  selector: 'app-new-headphones',
  templateUrl: './new-headphones.component.html',
  styleUrl: './new-headphones.component.scss'
})
export class NewHeadphonesComponent {

  headphones:Headphones = {} as Headphones;

  statusCode: number = 0;

  btnDisabled: boolean = false;

  constructor(private headphonesService:HeadphonesService, private logService:LogService, private router: Router) {
  }

  ngOnInit(){
    this.btnDisabled = false;
  }

  async onSubmit(form: any) {
    this.btnDisabled = true;

    let existingHeadphones:Headphones | null = {} as Headphones | null;

    existingHeadphones = await this.headphonesService.getHeadphonesBySerial(this.headphones.serial)

    if(existingHeadphones?.id != null){
      window.alert("An headphones with this serial already exists!");
    }else{
      this.statusCode = await this.headphonesService.addHeadphones(this.headphones);

      if (this.statusCode == 0){
        window.alert("New headphones added!");
        this.logService.addLog("Added headphones with serial: "+this.headphones.serial)
        this.router.navigate(['/home/headphones'])
      }
    }

    this.btnDisabled = false;
  }

}
