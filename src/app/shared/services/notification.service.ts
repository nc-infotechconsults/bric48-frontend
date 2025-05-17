import { inject, Injectable } from "@angular/core";
import { messageCallbackType } from "@stomp/stompjs";
import { BehaviorSubject } from "rxjs";
import { LogicOperator } from "../model/api/logic-operator";
import { QueryOperation } from "../model/api/query-operation";
import { Sort } from "../model/api/sort ";
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
    newNotification$ = new BehaviorSubject<MachineryNotification>(null);
    solvedNotification$ = new BehaviorSubject<MachineryNotification>(null);
    private machineryNotificationServices = inject(MachineryNotificationService);

    loadNotifications(userId?: string) {
        const filters = {
            criterias: [
                { field: 'solved', operation: QueryOperation.EQUAL, value: false }
            ], operator: LogicOperator.AND
        };

        if (userId)
            filters.criterias.push({ field: 'machinery.users.id', operation: QueryOperation.EQUAL, value: userId as any });

        this.machineryNotificationServices.search(filters, { sort: new Sort(['createdAt,desc']) }, true).subscribe(v => {
            this.notifications$.next(v.content);
        });
    }

    pushNewNotification(newNotification: MachineryNotification) {
        this.newNotification$.next(newNotification);
    }

    removeNotification(notification: MachineryNotification) {
        this.solvedNotification$.next(notification);
    }


    getNotificationsCount(notifications: MachineryNotification[], machineId?: string, type?: string) {
        if (machineId) {
            if (type)
                return notifications?.filter(x => machineId === x.machinery.id && x.type === type).length ?? 0;
            else
                return notifications?.filter(x => machineId === x.machinery.id && (x.type === 'alarm' || x.type === 'maintenance' || x.type === 'service')).length ?? 0;
        } else {
            if (type)
                return notifications?.filter(x => x.type === type).length ?? 0;
            else
                return notifications?.filter(x => x.type === 'alarm' || x.type === 'maintenance' || x.type === 'service').length ?? 0;
        }
    }

    existsGuards(notifications: MachineryNotification[], machineId?: string, guardType?: string) {
        // console.log('existsGuards', notifications, machineId, guardType);
        let result;
        if (machineId) {
            result = notifications?.find(x => x.machinery.id === machineId && x.type === 'guards' && x.description.toLowerCase() === guardType.toLowerCase()) !== undefined;
        } else {
            result = notifications?.find(x => x.type === 'guards' && x.description.toLowerCase() === guardType.toLowerCase()) !== undefined;
        }
        console.log('existsGuards result', result);
        return result;
    }

    lastGuard(notifications: MachineryNotification[], machineId?: string, guardType?: string) {
        let result;
        if (machineId) {
            result = notifications?.filter(x => x.machinery.id === machineId && x.type === 'guards' && x.description.toLowerCase() === guardType.toLowerCase()).sort((a, b) => a.createdAt > b.createdAt ? -1 : 1)[0]?.value ?? '';
        } else {
            result = notifications?.filter(x => x.type === 'guards' && x.description.toLowerCase() === guardType.toLowerCase()).sort((a, b) => a.createdAt > b.createdAt ? -1 : 1)[0]?.value ?? '';
        }
        console.log('lastGuard result', result);
        return result;
    }

    existsLastMode(notifications: MachineryNotification[], machineId?: string) {
        if (machineId) {
            return notifications?.find(x => x.machinery.id === machineId && x.type === 'status') !== undefined;
        } else {
            return notifications?.find(x => x.type === 'status') !== undefined;
        }
    }

    getLastModeTimestamp(notifications: MachineryNotification[], machineId?: string) {
        if (machineId) {
            return notifications?.filter(x => x.machinery.id === machineId && x.type === 'status').sort((a, b) => a.createdAt > b.createdAt ? -1 : 1)[0]?.createdAt ?? '';
        } else {
            return notifications?.filter(x => x.type === 'status').sort((a, b) => a.createdAt > b.createdAt ? -1 : 1)[0]?.createdAt ?? '';
        }
    }

    getLastMode(notifications: MachineryNotification[], machineId?: string) {
        if (machineId) {
            return notifications?.filter(x => x.machinery.id === machineId && x.type === 'status').sort((a, b) => a.createdAt > b.createdAt ? -1 : 1)[0]?.value ?? '';
        } else {
            return notifications?.filter(x => x.type === 'status').sort((a, b) => a.createdAt > b.createdAt ? -1 : 1)[0]?.value ?? '';
        }
    }

    getLedStatus(notifications: MachineryNotification[], machineId?: string) {
        const lastMode = this.getLastMode(notifications, machineId);
        const count = this.getNotificationsCount(notifications, machineId);
        if((lastMode && lastMode === '100') || count > 0){
            return 'danger';
        }else if(lastMode && lastMode === '50'){
            return 'warn';
        }else{
            return 'health';
        }
    }

}