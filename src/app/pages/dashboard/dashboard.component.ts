import { Component, inject, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { LogicOperator } from 'src/app/shared/model/api/logic-operator';
import { QueryOperation } from 'src/app/shared/model/api/query-operation';
import { Machinery } from 'src/app/shared/model/domain/machinery';
import { Roles } from 'src/app/shared/model/enums/role';
import { MachineryService } from 'src/app/shared/services/api/machinery.service';
import { AppConfigService } from 'src/app/shared/services/app-config.service';

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {

    private machineryService = inject(MachineryService);
    private layoutService = inject(LayoutService);
    private appConfigService = inject(AppConfigService);

    machineries: Machinery[] = [];

    ngOnInit(): void {
        this.appConfigService.loggedUser$.subscribe(loggedUser => {
            if (loggedUser !== null) {
                this.layoutService.isLoading.set(true);
                if (loggedUser.role.id === Roles.SECURITY_MANAGER) {
                    this.machineryService.search({
                        operator: LogicOperator.AND, criterias: [{
                            field: 'users.id',
                            operation: QueryOperation.EQUAL,
                            value: loggedUser.id
                        }]
                    }, {}, true).subscribe(v => {
                        this.machineries = v.content;
                        this.layoutService.isLoading.set(false);
                    });
                } else {
                    this.machineryService.search({}, {}, true).subscribe(v => {
                        this.machineries = v.content;
                        this.layoutService.isLoading.set(false);
                    });
                }
            }
        });
    }
}
