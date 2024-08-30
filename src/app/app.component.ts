import { Component, ViewEncapsulation } from '@angular/core';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

/**
 * @Component Main component
 */
@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, DashboardComponent, ToastModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    providers: [MessageService],
    encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
    constructor(private messageService: MessageService) {
    }
}
