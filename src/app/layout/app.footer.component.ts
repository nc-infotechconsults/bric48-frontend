import { Component } from '@angular/core';
import { LayoutService } from "./service/app.layout.service";
import { version } from 'src/environments/version';

@Component({
    selector: 'app-footer',
    templateUrl: './app.footer.component.html'
})
export class AppFooterComponent {
    version = version;
    constructor(public layoutService: LayoutService) { }
}
