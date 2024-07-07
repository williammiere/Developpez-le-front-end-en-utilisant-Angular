import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { map, Observable, of } from 'rxjs';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { StatsLabelsBarComponent } from 'src/app/components/stats-labels-bar/stats-labels-bar.component';
import { DetailPageData } from 'src/app/core/models/DetailPageData';
import { LineChartData } from 'src/app/core/models/LineChartData';
import { LineChartSerieData } from 'src/app/core/models/LineChartSerieData';
import { OlympicParticipant } from 'src/app/core/models/OlympicParticipant';
import { StatsLabel } from 'src/app/core/models/StatsLabel';
import { OlympicService } from 'src/app/core/services/olympic.service';

/**
 * Represents the detail page.
 */
@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [
    NgxChartsModule,
    StatsLabelsBarComponent,
    RouterLink,
    HeaderComponent
  ],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
})
export class DetailComponent implements OnInit {
  detailPageData$: Observable<DetailPageData> = of();

  countryName: string = '';
  entryCount: number = 0;
  medalCount: number = 0;
  athleteCount: number = 0;

  // Chart parameters:
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Dates';
  yAxisLabel: string = 'Medal count';
  xAxisTicks: string[] = [];

  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const participantId: string = this.route.snapshot.params['id'];
    this.detailPageData$ = this.getParticipantDetail(participantId);
  }

  /**
   * Get the home page data.
   * It contains the stats label data and the chart data.
   *
   * @returns the home page data.
   */
  getParticipantDetail(participantId: string): Observable<any> {
    return this.olympicService.getOlympicParticipant(participantId).pipe(
      map((participant) => {
        const statsLabels: StatsLabel[] = [];
        statsLabels.push(
          new StatsLabel(
            'Number of entries',
            participant!.participations.length
          )
        );
        statsLabels.push(
          new StatsLabel(
            'Total number medals',
            this.olympicService.getMedalCount(participant!)
          )
        );
        statsLabels.push(
          new StatsLabel(
            'Total number of athletes',
            this.olympicService.getAthleteCount(participant!)
          )
        );

        return new DetailPageData(
          participant!.country,
          statsLabels,
          this.fillChart(participant!)
        );
      })
    );
  }

  /**
   * Fills the line chart with the data of a participant.
   * This chart represents the medal count of the country through the years.
   * Only years when there was a participation are displayed.
   *
   * @param participant country represented on the chart.
   * @returns the line chart data
   */
  fillChart(participant: OlympicParticipant): LineChartData[] {
    let lineChartDataList: LineChartData[] = [];
    const series: LineChartSerieData[] = [];
    this.xAxisTicks = [];

    participant.participations.forEach((participation) => {
      series.push(
        new LineChartSerieData(participation.medalsCount, participation.year)
      );
      this.xAxisTicks.push(participation.year);
    });

    lineChartDataList.push(new LineChartData(participant.country, series));
    return lineChartDataList;
  }

  /**
   * Allows to display, for example, "2016" instead of "2 016"
   * in the x axis of the line chart, representing years.
   *
   * @param value x axis value
   * @returns formatted x axis value
   */
  xAxisTickFormatting(value: string) {
    return value;
  }
}
