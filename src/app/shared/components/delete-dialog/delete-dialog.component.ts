import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: '[delete-dialog]',
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.scss'
})
export class DeleteDialogComponent<T> {

  @Input()
  show: boolean = false;

  @Output() showChange = new EventEmitter<boolean>();

  @Output()
  onConfirm: EventEmitter<void> = new EventEmitter<void>();

  updateShow(value: boolean){
    this.show = value;
    this.showChange.emit(value);
  }

}
