import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AppConfigService } from '../shared/services/app-config.service';
import { NotificationService } from '../shared/services/notification.service';
import { LayoutService } from "./service/app.layout.service";

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items!: MenuItem[];

    sidebarVisible: boolean;

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    layoutService = inject(LayoutService);
    notificationsService = inject(NotificationService);

    private appConfigService = inject(AppConfigService)

    logout() {
        this.appConfigService.cleanAccessToken();
    }

}
