import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MachineryNotification } from '../shared/model/domain/machinery-notification';
import { AppConfigService } from '../shared/services/app-config.service';
import { NotificationService } from '../shared/services/notification.service';
import { LayoutService } from "./service/app.layout.service";

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnInit {

    items!: MenuItem[];
    notifications?: MachineryNotification[];

    sidebarVisible: boolean;

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    layoutService = inject(LayoutService);
    notificationsService = inject(NotificationService);

    private appConfigService = inject(AppConfigService)

    ngOnInit(): void {
        this.notificationsService.notifications$.subscribe(x => {
            this.notifications = x ?? [];
        })
    }

    logout() {
        this.appConfigService.cleanAccessToken();
    }

}
