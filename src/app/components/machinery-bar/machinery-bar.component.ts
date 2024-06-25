import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { MachineryService } from '../../services/machinery.service';
import { Router } from '@angular/router';
import { Machinery } from '../../models/machinery';

@Component({
  selector: 'app-machinery-bar',
  templateUrl: './machinery-bar.component.html',
  styleUrl: './machinery-bar.component.scss',
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('200ms ease-in', style({ transform: 'translateX(0%)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class MachineryBarComponent {

  constructor(private machineryService:MachineryService, private router: Router) {
  }

  machineries: Machinery[] | null = [];
  
  intervalId: any;

  visible: boolean = false;

  toggle() {
    this.visible = !this.visible;
  }

  async ngOnInit(){
    this.machineries = await this.machineryService.getMachineriesByAlarmIsSolved("False");
    if(this.machineries){
      sessionStorage.setItem('alarms_length', this.machineries?.length.toString())
    }else{
      sessionStorage.setItem('alarms_length', '0')
    }
    
    this.startPolling()
  }

  //On destroy
  ngOnDestroy() {
    this.stopPolling();
  }

  startPolling() {
    this.intervalId = setInterval(async () => {

      this.machineries = await this.machineryService.getMachineriesByAlarmIsSolved("False");
      if(this.machineries){
        sessionStorage.setItem('alarms_length', this.machineries?.length.toString())
      }
    
    }, 1000); // Esegui ogni secondo
  }

  stopPolling() {
    clearInterval(this.intervalId);
  }

  goToMachineryDetails(mserial: any) {
    sessionStorage.setItem('mserial', mserial)
    
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['home/details']);
  }
}
