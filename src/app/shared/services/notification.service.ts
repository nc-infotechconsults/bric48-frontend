import { inject, Injectable } from "@angular/core";
import { messageCallbackType } from "@stomp/stompjs";
import { BehaviorSubject } from "rxjs";
import { LogicOperator } from "../model/api/logic-operator";
import { QueryOperation } from "../model/api/query-operation";
import { MachineryNotification } from "../model/domain/machinery-notification";
import { MachineryNotificationService } from "./api/machinery-notification.service";

export interface TopicTask {
    topic: string;
    callback: messageCallbackType
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    notifications$ = new BehaviorSubject<MachineryNotification[]>(null);
    private machineryNotificationServices = inject(MachineryNotificationService);

    loadNotifications(userId?: string) {
        const filters = {
            criterias: [
                { field: 'solved', operation: QueryOperation.EQUAL, value: false },
                { field: 'type', operation: QueryOperation.EQUAL, value: 'alarm' }
            ], operator: LogicOperator.AND
        };

        if(userId)
            filters.criterias.push({ field: 'machinery.users.id', operation: QueryOperation.EQUAL, value: userId });

        this.machineryNotificationServices.search(filters, {}, true).subscribe(v => {
            this.notifications$.next(v.content);
        });
    }

}