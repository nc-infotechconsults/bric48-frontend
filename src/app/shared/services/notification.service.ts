import { inject, Injectable } from "@angular/core";
import { messageCallbackType } from "@stomp/stompjs";
import { Message } from "primeng/api";
import { BehaviorSubject } from "rxjs";
import { LogicOperator } from "../model/api/logic-operator";
import { QueryOperation } from "../model/api/query-operation";
import { MachineryNotificationService } from "./api/machinery-notification.service";

export interface TopicTask {
    topic: string;
    callback: messageCallbackType
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    private notifications$ = new BehaviorSubject<Message[]>(null);
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
            this.notifications$.next(v.content.map(x => ({ severity: 'error', summary: 'Alarm type: ' + x.type, detail: x.description})));
        });
    }

}