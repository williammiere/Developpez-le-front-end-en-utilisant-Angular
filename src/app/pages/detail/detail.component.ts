import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
})
export class DetailComponent {
  public olympics$: Observable<Olympic[]> = of([]);
  constructor(private olympicService: OlympicService) {}

  single!: any[];
  view!: [number, number];
  showXAxis!: boolean;
  showYAxis!: boolean;
  gradient!: boolean;
  showLegend!: boolean;
  showXAxisLabel!: boolean;
  xAxisLabel!: string;
  showYAxisLabel!: boolean;
  yAxisLabel!: string;
  graphDataChart!: any[];
  colorScheme!: string;

  //Configuration of line chart
  chartConfig(): void {
    this.single = [];

    this.view = [700, 400];
    this.showXAxis = true;
    this.showYAxis = true;
    this.gradient = false;
    this.showLegend = true;
    this.showXAxisLabel = true;
    this.xAxisLabel = 'Years';
    this.showYAxisLabel = true;
    this.yAxisLabel = 'Medals';
    this.graphDataChart = [];
    this.colorScheme = 'cool';
  }

  ngOnInit(): void {
    this.chartConfig();
    this.olympics$ = this.olympicService.getOlympics();
  }
}
