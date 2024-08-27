import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { DetailsComponent } from './pages/details/details.component';

export const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'details/:country', component: DetailsComponent },
    { path: '**', component: NotFoundComponent },
];
