import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

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

  visible: boolean = false;

  toggle() {
    this.visible = !this.visible;
  }

}
