import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { LineChartData } from 'src/app/core/models/LineChartData';
import { LineChartSerieData } from 'src/app/core/models/LineChartSerieData';
import { OlympicParticipant } from 'src/app/core/models/OlympicParticipant';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
})
export class DetailComponent implements OnInit {
  participants$: Observable<OlympicParticipant[]> = of([]);
  participantsSubscription!: Subscription;

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
  lineChartDataList: LineChartData[] = [];

  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const participantId: string = this.route.snapshot.params['id'];
    this.participants$ = this.olympicService.getOlympicParticipants();
    this.participantsSubscription = this.participants$.subscribe((olympics) => {
      this.onParticipantsChanged(olympics, participantId);
    });
  }

  onParticipantsChanged(participants: OlympicParticipant[], participantId: string): void {
    if (participants.length == 0) {
      return;
    }

    const participant: OlympicParticipant | undefined = participants.find(
      (participant) => participant.id == participantId
    );

    if (participant === undefined) {
      this.router.navigateByUrl('**');
      return;
    }

    this.countryName = participant.country;
    this.entryCount = participant.participations.length;
    this.medalCount = this.olympicService.getMedalCountByCountry(participant);
    this.athleteCount = this.olympicService.getAthleteCount(participant);

    this.fillChart(participant);
  }

  fillChart(participant: OlympicParticipant): void {
    const series: LineChartSerieData[] = [];

    this.xAxisTicks = [];
    this.lineChartDataList = [];

    participant.participations.forEach((participation) => {
      series.push(
        new LineChartSerieData(participation.medalsCount, participation.year)
      );
      this.xAxisTicks.push(participation.year);
    });

    this.lineChartDataList.push(new LineChartData(participant.country, series));
  }

  xAxisTickFormatting(value: string) {
    return value;
  }

  ngOnDestroy(): void {
    this.participantsSubscription.unsubscribe();
  }
}
