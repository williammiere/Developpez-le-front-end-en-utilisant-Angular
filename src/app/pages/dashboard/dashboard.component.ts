import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable, of, Subject, takeUntil } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { ChartModule } from 'primeng/chart';
import { AsyncPipe, NgIf, SlicePipe } from '@angular/common';
import { Olympic } from '../../core/models/Olympic';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

/**
 * @Component Home page
 * @description Olympics dashboard with statistics.
 */
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
export class DashboardComponent implements OnInit, OnDestroy {
    private notifier = new Subject<void>();
    loading: boolean = true;
    olympics$: Observable<Olympic[]> = of([]);
    olympicsCount: number = 0;
    countryCount: number = 0;
    chartData!: any;
    chartOptions!: any;

    constructor(
        private olympicService: OlympicService,
        private router: Router,
    ) {
    }

    ngOnInit(): void {
        this.olympics$ = this.olympicService.getOlympics();

        this.olympics$.pipe(takeUntil(this.notifier)).subscribe((olympics) => {
            // Get the unique count of years
            this.olympicsCount = new Set(
                olympics.flatMap((o) => o.participations.map((p) => p.year)),
            ).size;

            this.countryCount = olympics.length;

            // Define chart data
            this.chartData = {
                labels: olympics.map((o) => o.country),
                datasets: [
                    {
                        label: 'Medals',
                        data: olympics.map((o) => // Sum of medals for all olympics for a country
                            o.participations.reduce(
                                (sum, p) => sum + p.medalsCount,
                                0,
                            ),
                        ),
                    },
                ],
            };

            // Chart options
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

    ngOnDestroy(): void {
        this.notifier.next();
        this.notifier.complete();
    }

    /**
     * Navigate to the details page of the cliked country
     * @param e Chart click event
     */
    navigateToDetails(e: any) {
        this.router.navigateByUrl(
            `details/${this.chartData.labels[e.element.index].toLowerCase().replace(/ /g, '-')}`,
        );
    }
}
