import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { ChartModule } from 'primeng/chart';
import { AsyncPipe, SlicePipe } from '@angular/common';
import { Olympic } from '../../core/models/Olympic';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    imports: [ChartModule, AsyncPipe, SlicePipe],
})
export class DashboardComponent implements OnInit {
    public olympics$: Observable<Olympic[]> = of([]);
    public olympicsCount: number = 0;
    public countryCount: number = 0;
    public chartData!: any;
    public chartOptions!: any;

    constructor(
        private olympicService: OlympicService,
        private router: Router
    ) {}

    ngOnInit() {
        this.olympics$ = this.olympicService.getOlympics();

        this.olympics$.subscribe((data) => {
            this.olympicsCount = new Set(
                data.flatMap((o) => o.participations.map((p) => p.year))
            ).size;

            this.countryCount = data.length;

            this.chartData = {
                labels: data.map((o) => o.country),
                datasets: [
                    {
                        label: 'Medals',
                        data: data.map((o) =>
                            o.participations.reduce(
                                (sum, p) => sum + p.medalsCount,
                                0
                            )
                        ),
                    },
                ],
            };

            this.chartOptions = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                        },
                    },
                },
            };
        });
    }

    navigateToDetails(e: any) {
        this.router.navigateByUrl(`details/${this.chartData.labels[e.element.index].toLowerCase().replace(/ /g, '-')}`);
    }
}
