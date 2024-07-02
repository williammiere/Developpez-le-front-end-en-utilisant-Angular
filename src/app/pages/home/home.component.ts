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
  olympics$: Observable<Olympic[]> = of([]);
  olympicCount: number = 0;
  countryCount: number = 0;

  // Chart parameters
  showLabels: boolean = true;
  colorScheme: Color = {
    domain: ['#793d52', '#89a1db', '#9780a1', '#bfe0f1', '#b8cbe7', '#956065'],
    group: ScaleType.Ordinal,
    selectable: true,
    name: 'Customer Usage',
  };
  pieChartDataList: PieChartData[] = [];

  constructor(
    private olympicService: OlympicService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.olympics$.subscribe((olympics) => {
      this.onOlympicsChanged(olympics);
    });
  }

  onOlympicsChanged(olympics: Olympic[]) {
    this.countryCount = olympics.length;
    this.olympicCount = this.olympicService.getOlympicCount(olympics);
    this.fillChart(olympics);
  }

  fillChart(olympics: Olympic[]) {
    this.pieChartDataList = [];
    olympics.forEach((olympic) => {
      this.pieChartDataList.push(
        new PieChartData(
          olympic.country,
          this.olympicService.getMedalCountByOlympic(olympic),
          { id: olympic.id },
        ),
      );
    });
  }

  onSelect(data: PieChartData): void {
    this.router.navigateByUrl(`detail/${data.extra['id']}`);
  }
}
