import { Component } from '@angular/core';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, DashboardComponent],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {}
