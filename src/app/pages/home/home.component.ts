import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { map, Observable, of } from 'rxjs';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { StatsLabelsBarComponent } from 'src/app/components/stats-labels-bar/stats-labels-bar.component';
import { HomePageData } from 'src/app/core/models/HomePageData';
import { OlympicParticipant } from 'src/app/core/models/OlympicParticipant';
import { PieChartData } from 'src/app/core/models/PieChartData';
import { StatsLabel } from 'src/app/core/models/StatsLabel';
import { OlympicService } from 'src/app/core/services/olympic.service';

/**
 * Represents the Home page.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [StatsLabelsBarComponent, NgxChartsModule, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  homePageData$: Observable<HomePageData> = of();

  // Chart parameters
  showLabels: boolean = true;
  colorScheme: Color = {
    domain: ['#793d52', '#89a1db', '#9780a1', '#bfe0f1', '#b8cbe7', '#956065'],
    group: ScaleType.Ordinal,
    selectable: true,
    name: 'Customer Usage',
  };

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.homePageData$ = this.getHomePageData();
  }

  /**
   * Get the home page data.
   * It contains the stats label data and the chart data.
   *
   * @returns the home page data.
   */
  getHomePageData(): Observable<HomePageData> {
    return this.olympicService.getOlympicParticipants().pipe(
      map((participants) => {
        const olympicCount = this.olympicService.getOlympicCount(participants);

        const statsLabels: StatsLabel[] = [];
        statsLabels.push(
          {
            name: 'Number of JOs',
            value: olympicCount,
          },
          {
            name: 'Number of countries',
            value: participants.length,
          }
        );

        return {
          statsLabels: statsLabels,
          pieChartDataList: this.fillChart(participants),
        };
      })
    );
  }

  /**
   * Fills the pie chart with the participating countries data.
   * This chart shows the earned medal count distribution for each country.
   *
   * @param participants participating countries
   */
  fillChart(participants: OlympicParticipant[]): PieChartData[] {
    let pieChartDataList: PieChartData[] = [];
    participants.forEach((olympic) => {
      pieChartDataList.push({
        name: olympic.country,
        value: this.olympicService.getMedalCount(olympic),
        extra: { id: olympic.id },
      });
    });
    return pieChartDataList;
  }

  /**
   * Called when clicking on a pie chart slice.
   *
   * @param data data of the related slice.
   */
  onSelect(data: PieChartData): void {
    this.router.navigateByUrl(`detail/${data.extra['id']}`);
  }
}
