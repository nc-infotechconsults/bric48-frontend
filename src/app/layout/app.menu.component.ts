import { Component, inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];
    layoutService = inject(LayoutService);
    
    private translateService = inject(TranslateService);

    ngOnInit() {
        this.model = [
            {
                label: this.translateService.instant('layout.sidebar.menu.title'),
                items: [
                    { label: this.translateService.instant('layout.sidebar.menu.dashboard'), icon: 'pi pi-fw pi-home', routerLink: ['/app/'] },
                    { label: this.translateService.instant('layout.sidebar.menu.machineryNotification'), icon: 'pi pi-fw pi-bell', routerLink: ['/app/machinery-notification'] },
                    { label: this.translateService.instant('layout.sidebar.menu.message'), icon: 'pi pi-fw pi-envelope', routerLink: ['/app/message'] },
                    { label: this.translateService.instant('layout.sidebar.menu.beacon'), icon: 'pi pi-fw pi-circle-on', routerLink: ['/app/beacon'] },
                    { label: this.translateService.instant('layout.sidebar.menu.headphone'), icon: 'pi pi-fw pi-volume-up', routerLink: ['/app/headphone'] },
                    { label: this.translateService.instant('layout.sidebar.menu.structure'), icon: 'pi pi-fw pi-building', routerLink: ['/app/structure'] },
                    { label: this.translateService.instant('layout.sidebar.menu.area'), icon: 'pi pi-fw pi-microsoft', routerLink: ['/app/area'] },
                    { label: this.translateService.instant('layout.sidebar.menu.machinery'), icon: 'pi pi-fw pi-car', routerLink: ['/app/machinery'] },
                    { label: this.translateService.instant('layout.sidebar.menu.defaultMessage'), icon: 'pi pi-fw pi-book', routerLink: ['/app/default-message'] },
                    { label: this.translateService.instant('layout.sidebar.menu.user'), icon: 'pi pi-fw pi-users', routerLink: ['/app/user'] }
                ]
            }
        ];
    }
}
