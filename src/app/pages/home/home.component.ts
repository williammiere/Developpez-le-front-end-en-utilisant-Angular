import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { Observable, of } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { PieChartData } from 'src/app/core/models/PieChartData';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<Olympic[]> = of([]);
  public pieChartDataList: PieChartData[] = [];
  public olympicCount: number = 0;
  public countryCount: number = 0;

  // options
  showLabels: boolean = true;
  legendPosition: string = 'below';

  colorScheme: Color = {
    domain: ['#793d52', '#89a1db', '#9780a1', '#bfe0f1', '#b8cbe7', '#956065'],
    group: ScaleType.Ordinal,
    selectable: true,
    name: 'Customer Usage',
  };

  constructor(
    private olympicService: OlympicService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.olympics$.subscribe((olympics) => {
      this.countryCount = olympics.length;
      this.olympicCount = this.getOlympicCount(olympics);

      olympics.forEach((olympic) => {
        this.pieChartDataList.push(
          new PieChartData(
            olympic.country,
            this.getMedalCountByOlympic(olympic),
            { id: olympic.id },
          ),
        );
      });
    });
  }

  getMedalCountByOlympic(olympic: Olympic): number {
    return olympic.participations.reduce((medalCount, participation) => {
      return medalCount + participation.medalsCount;
    }, 0);
  }

  getOlympicCount(olympics: Olympic[]): number {
    let cities: Set<string> = new Set();
    olympics.forEach((olympic) => {
      olympic.participations.forEach((participation) => {
        cities.add(participation.city);
      });
    });
    return cities.size;
  }

  onSelect(data: PieChartData): void {
    this.router.navigateByUrl(`detail/${data.extra['id']}`);
  }
}
