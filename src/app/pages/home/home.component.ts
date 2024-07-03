import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { Observable, of, Subscription } from 'rxjs';
import { OlympicParticipant } from 'src/app/core/models/OlympicParticipant';
import { PieChartData } from 'src/app/core/models/PieChartData';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  participants$: Observable<OlympicParticipant[]> = of([]);
  participantsSubscription!: Subscription;
  olympicCount: number = 0;
  participantCount: number = 0;

  // Chart parameters
  showLabels: boolean = true;
  colorScheme: Color = {
    domain: ['#793d52', '#89a1db', '#9780a1', '#bfe0f1', '#b8cbe7', '#956065'],
    group: ScaleType.Ordinal,
    selectable: true,
    name: 'Customer Usage',
  };
  pieChartDataList: PieChartData[] = [];

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.participants$ = this.olympicService.getOlympicParticipants();
    this.participantsSubscription = this.participants$.subscribe((olympics) => {
      this.onParticipantsChanged(olympics);
    });
  }

  onParticipantsChanged(participants: OlympicParticipant[]) {
    this.participantCount = participants.length;
    this.olympicCount = this.olympicService.getOlympicCount(participants);
    this.fillChart(participants);
  }

  fillChart(participants: OlympicParticipant[]) {
    this.pieChartDataList = [];
    participants.forEach((olympic) => {
      this.pieChartDataList.push(
        new PieChartData(
          olympic.country,
          this.olympicService.getMedalCountByCountry(olympic),
          { id: olympic.id }
        )
      );
    });
  }

  onSelect(data: PieChartData): void {
    this.router.navigateByUrl(`detail/${data.extra['id']}`);
  }

  ngOnDestroy(): void {
    this.participantsSubscription.unsubscribe();
  }
}
