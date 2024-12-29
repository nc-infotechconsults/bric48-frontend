import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MachineryNotification } from '../shared/model/domain/machinery-notification';
import { AppConfigService } from '../shared/services/app-config.service';
import { NotificationService } from '../shared/services/notification.service';
import { WebSocketService } from '../shared/services/websocket.service';
import { LayoutService } from "./service/app.layout.service";

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnInit {

    items!: MenuItem[];
    notifications?: MachineryNotification[];

    showDetail = false;
    machineryId = false;

    sidebarVisible: boolean;

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    layoutService = inject(LayoutService);
    websocket = inject(WebSocketService);
    notificationsService = inject(NotificationService);

    private appConfigService = inject(AppConfigService)

    ngOnInit(): void {
        this.notificationsService.notifications$.subscribe(x => {
            this.notifications = x ?? [];
        })

        this.notificationsService.newNotification$.subscribe(x => {
            if (x != null && !this.notifications.find(v => v.id === x.id)) {
                this.notifications.unshift(x);
                this.sidebarVisible = true;
            }
        });

        this.notificationsService.solvedNotification$.subscribe(x => {
            if (x != null) {
                this.notifications = this.notifications.filter(v => v.id !== x.id);
            }
        });
    }

    logout() {
        this.appConfigService.cleanAccessToken();
        this.websocket.disconnect();
    }

}
