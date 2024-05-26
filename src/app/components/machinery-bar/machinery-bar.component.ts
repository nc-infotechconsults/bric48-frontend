import { Component } from '@angular/core';

@Component({
  selector: 'app-machinery-bar',
  templateUrl: './machinery-bar.component.html',
  styleUrl: './machinery-bar.component.scss'
})
export class MachineryBarComponent {

  visible: boolean = false;

  toggle() {
    this.visible = !this.visible;
  }

}
