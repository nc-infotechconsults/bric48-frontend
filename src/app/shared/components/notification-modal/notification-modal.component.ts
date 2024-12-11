import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { forkJoin } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { LogicOperator } from '../../model/api/logic-operator';
import { QueryOperation } from '../../model/api/query-operation';
import { Machinery } from '../../model/domain/machinery';
import { MachineryNotification } from '../../model/domain/machinery-notification';
import { User } from '../../model/domain/user';
import { MachineryNotificationService } from '../../services/api/machinery-notification.service';
import { MachineryService } from '../../services/api/machinery.service';
import { MessageService as MqttMessageService } from '../../services/api/message.service';
import { UserService } from '../../services/api/user.service';
import { WebSocketService } from '../../services/websocket.service';

@Component({
  selector: '[notification-dialog]',
  templateUrl: './notification-modal.component.html',
  styleUrl: './notification-modal.component.scss'
})
export class NotificationModalComponent {

  private machineryNotificationService = inject(MachineryNotificationService);
  private mqttMessageService = inject(MqttMessageService);
  private machineryService = inject(MachineryService);
  private messageService = inject(MessageService);
  private translateService = inject(TranslateService);

  private layout = inject(LayoutService);
  private websocket = inject(WebSocketService);
  private userService = inject(UserService);

  @Input()
  set machineryId(id: string) {
    if (id) {
      this.layout.isLoading.set(true);
      forkJoin({
        machinery: this.machineryService.getById(id),
        notifications: this.machineryNotificationService.search({
          criterias: [
            { field: 'solved', operation: QueryOperation.EQUAL, value: false },
            { field: 'type', operation: QueryOperation.EQUAL, value: 'alarm' },
            { field: 'machinery.id', operation: QueryOperation.EQUAL, value: id },
          ], operator: LogicOperator.AND
        }, {}, true),
        userNearMachinery: this.userService.getUserNearMachinery(id)
      }).subscribe(x => {
        this._users = x.userNearMachinery ?? [];
        this._machinery = x.machinery;
        this._machineryNotifications = x.notifications.content;
        this.layout.isLoading.set(false);
      });
    }
  };

  _machineryNotifications?: MachineryNotification[] = [];
  _machinery?: Machinery;
  _users: User[] = [];
  _userSelected: { [x: string]: string } = {};

  @Input()
  show: boolean = false;

  @Output() showChange = new EventEmitter<boolean>();

  updateShow(value: boolean) {
    this.show = value;
    if (!this.show) {
      this._users = [];
      this._machineryNotifications = [];
      this._machinery = undefined;
    }
    this.showChange.emit(value);
  }

  solveNotification(notification: MachineryNotification) {
    this.machineryNotificationService.resolve(notification.id).subscribe((x) => {
      this.messageService.add({
        severity: 'success',
        summary: this.translateService.instant('shared.messages.updateSuccess.summary'),
        detail: this.translateService.instant('shared.messages.updateSuccess.detail'),
      });
    });
  }

  sendMessage(notification: MachineryNotification) {
    const requests = {};
    Object.entries(this._userSelected).filter(x => x[1]).forEach(x => requests[x[0]] = this.mqttMessageService.save({ message: notification.description, receiverId: x[0], notificationId: notification.id }));

    forkJoin(requests).subscribe((x) => {
      this.messageService.add({
        severity: 'success',
        summary: this.translateService.instant('shared.messages.sendSuccess.summary'),
        detail: this.translateService.instant('shared.messages.sendSuccess.detail'),
      });
    });
  }

  thereAreUserSelected() {
    return Object.entries(this._userSelected).filter(x => x[1]).length > 0;
  }

}
