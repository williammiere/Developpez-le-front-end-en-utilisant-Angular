import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { ChartModule } from 'primeng/chart';
import { AsyncPipe, NgIf, SlicePipe } from '@angular/common';
import { Olympic } from '../../core/models/Olympic';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    imports: [
        ChartModule,
        AsyncPipe,
        SlicePipe,
        CardModule,
        NgIf,
        SkeletonModule,
        ProgressSpinnerModule,
    ],
    encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
    loading: boolean = true;
    olympics$: Observable<Olympic[]> = of([]);
    olympicsCount: number = 0;
    countryCount: number = 0;
    chartData!: any;
    chartOptions!: any;

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

        this.loading = false;
    }

    navigateToDetails(e: any) {
        this.router.navigateByUrl(
            `details/${this.chartData.labels[e.element.index].toLowerCase().replace(/ /g, '-')}`
        );
    }
}
