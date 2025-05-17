import { Component, inject, OnInit } from '@angular/core';
import { last } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { LogicOperator } from 'src/app/shared/model/api/logic-operator';
import { QueryOperation } from 'src/app/shared/model/api/query-operation';
import { Machinery } from 'src/app/shared/model/domain/machinery';
import { MachineryNotification } from 'src/app/shared/model/domain/machinery-notification';
import { Roles } from 'src/app/shared/model/enums/role';
import { MachineryService } from 'src/app/shared/services/api/machinery.service';
import { AppConfigService } from 'src/app/shared/services/app-config.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {

    showDetail = false;
    machineryId?: string;

    private machineryService = inject(MachineryService);
    private layoutService = inject(LayoutService);
    private appConfigService = inject(AppConfigService);
    
    notificationService = inject(NotificationService);

    machineries: Machinery[] = [];
    notifications: MachineryNotification[] = [];

    openDetailModal(machine: Machinery) {
        this.showDetail = true;
        this.machineryId = machine.id;
    }

    ngOnInit(): void {
        this.appConfigService.loggedUser$.subscribe(loggedUser => {
            if (loggedUser !== null) {
                this.layoutService.isLoading.set(true);
                if (loggedUser.role.id === Roles.SECURITY_MANAGER) {
                    this.machineryService.search({
                        operator: LogicOperator.AND, criterias: [{
                            field: 'users.id',
                            operation: QueryOperation.EQUAL,
                            value: loggedUser.id
                        }]
                    }, {}, true).subscribe(v => {
                        this.machineries = v.content;
                        this.layoutService.isLoading.set(false);
                    });
                } else {
                    this.machineryService.search({}, {}, true).subscribe(v => {
                        this.machineries = v.content;
                        this.layoutService.isLoading.set(false);
                    });
                }
            }
        });

        this.notificationService.notifications$.subscribe(notifications => {
            this.notifications = notifications;
        });

        this.notificationService.newNotification$.subscribe(x => {
            if (x != null && !this.notifications.find(v => v.id === x.id)) {
                this.notifications.unshift(x);
            }
        });

        this.notificationService.solvedNotification$.subscribe(x => {
            if (x != null) {
                this.notifications = this.notifications.filter(v => v.id !== x.id);
            }
        });
    }

}
