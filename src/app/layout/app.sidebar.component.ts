import { Component, ElementRef, inject, OnInit } from '@angular/core';
import { User } from '../shared/model/domain/user';
import { AppConfigService } from '../shared/services/app-config.service';
import { LayoutService } from "./service/app.layout.service";

@Component({
    selector: 'app-sidebar',
    templateUrl: './app.sidebar.component.html'
})
export class AppSidebarComponent implements OnInit {
    private appConfigService = inject(AppConfigService);
    public layoutService = inject(LayoutService);
    public el = inject(ElementRef);

    loggedUser: User;

    ngOnInit(): void {
        this.appConfigService.loggedUser$.subscribe(v => this.loggedUser = v);
    }
    
}

