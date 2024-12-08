import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { DialogModule } from 'primeng/dialog';
import { MenuModule } from 'primeng/menu';
import { MessagesModule } from 'primeng/messages';
import { PanelMenuModule } from 'primeng/panelmenu';
import { StyleClassModule } from 'primeng/styleclass';
import { TableModule } from 'primeng/table';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardsRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

@NgModule({
    imports: [
        CommonModule,
        BadgeModule,
        DialogModule,
        FormsModule,
        ChartModule,
        MenuModule,
        TableModule,
        StyleClassModule,
        MessagesModule,
        CardModule,
        PanelMenuModule,
        ButtonModule,
        TranslateModule,
        SharedModule,
        DashboardsRoutingModule
    ],
    declarations: [DashboardComponent]
})
export class DashboardModule { }
