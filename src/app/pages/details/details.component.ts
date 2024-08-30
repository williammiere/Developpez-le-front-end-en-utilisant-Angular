import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OlympicService } from '../../core/services/olympic.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Olympic } from '../../core/models/Olympic';
import { AsyncPipe, NgIf } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

/**
 * @Component Details page
 * @description Details of the olympics for a country.
 * Redirect to 404 page if no country is found.
 */
@Component({
    selector: 'app-details',
    standalone: true,
    imports: [
        AsyncPipe,
        ChartModule,
        NgIf,
        ButtonModule,
        CardModule,
        SkeletonModule,
        ProgressSpinnerModule,
        ToastModule,
    ],
    templateUrl: './details.component.html',
    styleUrl: './details.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class DetailsComponent implements OnInit, OnDestroy {
    private notifier = new Subject<void>();
    loading: boolean = true;
    olympic$!: Observable<Olympic | undefined>;
    olympicsCount!: number;
    totalMedalCount!: number;
    totalAthleteCount!: number;
    chartData!: any;
    chartOptions!: any;

    constructor(
        private route: ActivatedRoute,
        private olympicService: OlympicService,
        private router: Router,
        private messageService: MessageService,
    ) {
    }

    ngOnInit(): void {
        const country = this.route.snapshot.params['country'];
        this.olympic$ = this.olympicService.getOlympicByCountry(country);

        this.olympic$.pipe(takeUntil(this.notifier)).subscribe({
            next: (o) => {
                // If no olympic found, redirect to 404
                if (o === undefined) {
                    this.router.navigate(['/**'], { skipLocationChange: true });
                } else {
                    this.olympicsCount = o.participations.length;

                    this.totalMedalCount = o.participations.reduce(
                        (sum, p) => sum + p.medalsCount,
                        0,
                    );

                    this.totalAthleteCount = o.participations.reduce(
                        (sum, p) => sum + p.athleteCount,
                        0,
                    );

                    // Define chart data
                    this.chartData = {
                        labels: o.participations.map((p) => p.year), // Years for x axis
                        datasets: [
                            {
                                label: 'Medals',
                                data: o.participations.map((p) => p.medalsCount), // Medal count for y axis
                                fill: false,
                            },
                        ],
                    };
                }

                // Simulate a timeout for loading
                setTimeout(() => {
                    this.loading = false;
                }, 1500);
            },
            error: (error) => {
                this.messageService.add({ severity: 'error', summary: 'An error occured', detail: error.message });
                this.router.navigate(['/']);
            },
        });

        // Chart options
        this.chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                    },
                },
            },
        };
    }

    ngOnDestroy(): void {
        this.notifier.next();
        this.notifier.complete();
    }

    /**
     * Navigate to home page
     */
    nagivateToHome() {
        this.router.navigate(['/']);
    }
}
