import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: '[detail-dialog]',
  templateUrl: './detail-modal.component.html',
  styleUrl: './detail-modal.component.scss'
})
export class DetailModalComponent {
  
  @Input()
  show: boolean = false;

  @Output() showChange = new EventEmitter<boolean>();

  updateShow(value: boolean){
    this.show = value;
    this.showChange.emit(value);
  }

  @Input()
  editMode: boolean = false;

  @Input()
  disableConfirm: boolean = false;

  @Output()
  onConfirm: EventEmitter<void> = new EventEmitter<void>();
}
