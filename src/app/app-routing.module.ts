import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', pathMatch: 'full', redirectTo: '/auth/login'
            },
            {
                path: 'app', component: AppLayoutComponent,
                children: [
                    { path: '', loadChildren: () => import('./components/dashboard/dashboard.module').then(m => m.DashboardModule) },
                    { path: 'area', loadChildren: () => import('./pages/area/area.module').then(m => m.AreaModule) },
                    { path: 'structure', loadChildren: () => import('./pages/structure/structure.module').then(m => m.StructureModule) },
                    { path: 'beacon', loadChildren: () => import('./pages/beacon/beacon.module').then(m => m.BeaconModule) },
                    { path: 'machinery', loadChildren: () => import('./pages/machinery/machinery.module').then(m => m.MachineryModule) },
                    { path: 'headphone', loadChildren: () => import('./pages/headphone/headphone.module').then(m => m.HeadphoneModule) },
                    { path: 'default-message', loadChildren: () => import('./pages/default-message/default-message.module').then(m => m.DefaultMessageModule) },
                    { path: 'message', loadChildren: () => import('./pages/message/message.module').then(m => m.MessageModule) },
                    { path: 'machinery-notification', loadChildren: () => import('./pages/machinery-notification/machinery-notification.module').then(m => m.MachineryNotificationModule) },
                    { path: 'user', loadChildren: () => import('./pages/user/user.module').then(m => m.UserModule) },
                    { path: 'profile', loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule) },
                ]
            },
            { path: 'auth', loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule) },
            { path: 'notfound', component: NotfoundComponent },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
