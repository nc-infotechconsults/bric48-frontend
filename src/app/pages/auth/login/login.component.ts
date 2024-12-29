import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { CredentialsDTO } from 'src/app/shared/model/dto/credentials.dto';
import { AuthService } from 'src/app/shared/services/api/auth.service';
import { AppConfigService } from 'src/app/shared/services/app-config.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent {

    layoutService = inject(LayoutService);
    fgCredentials: FormGroup;

    private fb = inject(FormBuilder);
    private router = inject(Router);
    private authService = inject(AuthService);
    private messageService = inject(MessageService);
    private appConfigService = inject(AppConfigService);
    private translateService = inject(TranslateService);

    constructor() {
        this.fgCredentials = this.fb.group({
            username: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]]
        });

        if(this.appConfigService.getAccessToken())
            this.router.navigateByUrl('/app');
    }

    login() {
        const credentials = this.fgCredentials.value as CredentialsDTO;
        this.authService.login(credentials).subscribe({
            next: (v) => {
                this.appConfigService.setAccessToken(v);
                this.appConfigService.updateSession$.next();
                this.router.navigateByUrl('/app');
            },
            error: (err) => {
                console.error(err);
                if (err.error && err.error.type.includes('BadCredentialsException'))
                    this.messageService.add({
                        severity: 'warn',
                        summary: this.translateService.instant('pages.auth.login.badCredentials.summary'),
                        detail: this.translateService.instant('pages.auth.login.badCredentials.detail'),
                    })
                else
                    this.messageService.add({
                        severity: 'error',
                        summary: this.translateService.instant('shared.errors.genericError.summary'),
                        detail: this.translateService.instant('shared.errors.genericError.detail'),
                    });

            }
        })
    }
}
