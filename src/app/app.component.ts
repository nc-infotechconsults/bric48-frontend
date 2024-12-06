import { Component, inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import { AuthService } from './shared/services/api/auth.service';
import { AppConfigService } from './shared/services/app-config.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    private authService = inject(AuthService);
    private appConfigService = inject(AppConfigService);
    private primengConfig = inject(PrimeNGConfig); 
    private translate = inject(TranslateService); 

    constructor() { 
        this.translate.addLangs(['it', 'en']);
        this.translate.setDefaultLang('en');
        this.translate.use('en');
    }

    ngOnInit() {
        this.primengConfig.ripple = true;
        this.authService.session().subscribe({
            next: (v) => {
                console.log(v);
                this.appConfigService.loggedUser.set(v);
            },
            error: (err) => {
                if(err.status === 401 || err.status === 403){
                    this.appConfigService.cleanAccessToken();
                }
            }
        });
    }
}
