import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OlympicService } from '../../core/services/olympic.service';
import { Observable } from 'rxjs';
import { Olympic } from '../../core/models/Olympic';
import { AsyncPipe, NgIf } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-details',
    standalone: true,
    imports: [AsyncPipe, ChartModule, NgIf, ButtonModule],
    templateUrl: './details.component.html',
    styleUrl: './details.component.scss',
})
export class DetailsComponent implements OnInit {
    public olympic$!: Observable<Olympic | undefined>;
    public olympicsCount!: number;
    public totalMedalCount!: number;
    public totalAthleteCount!: number;
    public chartData!: any;
    public chartOptions!: any;

    constructor(
        private route: ActivatedRoute,
        private olympicService: OlympicService,
        private router: Router
    ) {}

    ngOnInit(): void {
        const country = this.route.snapshot.params['country'];
        this.olympic$ = this.olympicService.getOlympicByCountry(country);

        this.olympic$.subscribe((o) => {
            if (o === undefined) {
                this.router.navigate(['/**'], { skipLocationChange: true });
            } else {
                this.olympicsCount = o.participations.length;
                this.totalMedalCount = o.participations.reduce(
                    (sum, p) => sum + p.medalsCount,
                    0
                );
                this.totalAthleteCount = o.participations.reduce(
                    (sum, p) => sum + p.athleteCount,
                    0
                );
                this.chartData = {
                    labels: o.participations.map((p) => p.year),
                    datasets: [
                        {
                            label: 'Medals',
                            data: o.participations.map((p) => p.medalsCount),
                            fill: false,
                        },
                    ],
                };
            }
        });

        this.chartOptions = {
            responsive: true,
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

    nagivateToHome() {
        this.router.navigate(['/']);
    }
}
