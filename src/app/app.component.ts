import { Component, inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import { Roles } from './shared/model/enums/role';
import { AuthService } from './shared/services/api/auth.service';
import { UserService } from './shared/services/api/user.service';
import { AppConfigService } from './shared/services/app-config.service';
import { NotificationService } from './shared/services/notification.service';
import { TopicTask, WebSocketService } from './shared/services/websocket.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    private authService = inject(AuthService);
    private appConfigService = inject(AppConfigService);
    private notificationService = inject(NotificationService);
    private userService = inject(UserService);
    private primengConfig = inject(PrimeNGConfig);
    private translate = inject(TranslateService);
    private websocket = inject(WebSocketService);

    constructor() {
        this.translate.addLangs(['it', 'en']);
        this.translate.setDefaultLang('en');
        this.translate.use('en');
    }

    ngOnInit() {
        this.primengConfig.ripple = true;
        this.appConfigService.updateSession$.subscribe(v => {
            this.websocket.disconnect();
            this.authService.session().subscribe({
                next: (v) => {
                    this.appConfigService.setLoggedUser(v);

                    const newNotificationCbk = (message) => {
                        console.log('Received: ', message.body);
                        this.notificationService.pushNewNotification(JSON.parse(message.body));
                        return;
                    };

                    const solvedNotificationCbk = (message) => {
                        console.log('Received: ', message.body);
                        this.notificationService.removeNotification(JSON.parse(message.body));
                        return;
                    };

                    const machineriesUsers: TopicTask = {
                        topic: '/machinery-users', 
                        callback: (message) => {
                            console.log('Received: ', message.body);
                            this.userService.userMachineries$.next(JSON.parse(message.body));
                            return;
                        }
                    };

                    if(v.role.id === Roles.SECURITY_MANAGER){
                        this.notificationService.loadNotifications(v.id);
                        this.websocket.connect(v.id, [
                            {
                                topic: '/notification/' + v.id, 
                                callback: newNotificationCbk
                            },
                            {
                                topic: '/notification/solved/' + v.id, 
                                callback: solvedNotificationCbk
                            },
                            machineriesUsers
                        ]);
                    }else{
                        this.notificationService.loadNotifications();
                        this.websocket.connect(v.id, [
                            {
                                topic: '/notification/administrators', 
                                callback: newNotificationCbk
                            },
                            {
                                topic: '/notification/solved/administrators', 
                                callback: solvedNotificationCbk
                            },
                            machineriesUsers
                        ]);
                    }
                },
                error: (err) => {
                    if (err.status === 401 || err.status === 403) {
                        this.appConfigService.cleanAccessToken();
                        this.websocket.disconnect();
                    }
                }
            });
        });
        this.appConfigService.updateSession$.next();
    }
}
