import { Component, inject, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { LogicOperator } from 'src/app/shared/model/api/logic-operator';
import { MachineryNotification } from 'src/app/shared/model/domain/machinery-notification';
import { DropdownFilter } from 'src/app/shared/model/ui/header-item';
import { LazyLoadEmitterEvent } from 'src/app/shared/model/ui/lazy-load-emitter-event';
import { MachineryNotificationService } from 'src/app/shared/services/api/machinery-notification.service';
import { MachineryService } from 'src/app/shared/services/api/machinery.service';

@Component({
  selector: 'app-machinery-notification',
  templateUrl: './machinery-notification.component.html',
  styleUrl: './machinery-notification.component.scss'
})
export class MachineryNotificationComponent extends TableComponent<MachineryNotification> implements OnInit {

  private service = inject(MachineryNotificationService);
  private machineryService = inject(MachineryService);

  override globalFieldFilters: string[] = ['type', 'value', 'description', 'machinery.name', 'machinery.serial'];

  ngOnInit(): void {
    this.layout.isLoading.set(true);

    forkJoin({
      machineries: this.machineryService.search({operator: LogicOperator.AND }, {}, true)
    }).subscribe({
      next: (v) => {
        this.headers = [
          {
            title: 'pages.machineryNotification.table.createdAt', field: 'createdAt', sortable: true, filter: {
              type: 'text', showMenu: false, matchMode: 'contains'
            }
          },
          {
            title: 'pages.machineryNotification.table.machinery', field: 'machinery.id', sortable: true, filter: {
              type: 'dropdown', showMenu: false, matchMode: 'equals', values: v.machineries.content.map(x => ({ value: x.id, label: x.name + '(' + x.serial + ')' }))
            } as DropdownFilter
          },
          {
            title: 'pages.machineryNotification.table.type', field: 'type', sortable: true, filter: {
              type: 'text', showMenu: false, matchMode: 'contains'
            }
          },
          {
            title: 'pages.machineryNotification.table.value', field: 'value', sortable: true, filter: {
              type: 'text', showMenu: false, matchMode: 'contains'
            }
          },
          {
            title: 'pages.machineryNotification.table.description', field: 'description', sortable: true, filter: {
              type: 'text', showMenu: false, matchMode: 'contains'
            }
          },
          {
            title: 'pages.machineryNotification.table.solved', field: 'solved', sortable: true, filter: {
              type: 'boolean', showMenu: false, matchMode: 'contains'
            }
          }
        ];
        this.layout.isLoading.set(false);
      }
    })
  }

  protected override loadData(event: LazyLoadEmitterEvent): void {
    super.loadData(event);
    this.layout.isLoading.set(true);

    forkJoin({
      notifications: this.service.search(event.filters, event.page)
    }).subscribe({
      next: (v) => {
        this.values = v.notifications.content;
        this.totalRecords = v.notifications.page.totalElements;
        event.originalEvent.forceUpdate();
        this.layout.isLoading.set(false);
      }
    })
  }

}
