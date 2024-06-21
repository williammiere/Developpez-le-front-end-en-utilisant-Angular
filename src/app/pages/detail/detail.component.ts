import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { Observable, map, switchMap } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { Participation } from 'src/app/core/models/Participation';
import { Medal } from 'src/app/core/models/medal';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {

  countryId: number | null = null;
  countryDetails$: Observable<Olympic | undefined> | undefined;
  lineChartData!: any[];
  totalParticipations: number = 0;
  totalAthletes!: number;
  medalLenght!: number;
  colorScheme: Color = {
    name: 'cool',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C']
  };

  
  constructor(private olympicService: OlympicService,
    private route: ActivatedRoute) { }

    ngOnInit(): void {
      this.countryDetails$ = this.route.params.pipe(
        map(params => +params['id']),
        switchMap(id => this.olympicService.getCountryDetails(id))
      );
  
      this.countryDetails$.subscribe(country => {
        if (country) {
          this.lineChartData = this.transformToLineChartData(country.participations);
          this.totalAthletes = this.totalAthleteCount(country.participations);
          this.totalParticipations = this.calculateTotalParticipations(country.participations);
          this.medalLenght = this.totalMedalCount(country.participations);
        }
      });
    }       
  
    private transformToLineChartData(participations: Participation[]): any[] {
      const medalsSeries = {
        name: 'Medals Count',
        series: participations.map((participation: Participation) => ({
          name: participation.year.toString(),
          value: participation.medalsCount
        }))
      };
      
      const athletesSeries = {
        name: 'Athlete Count',
        series: participations.map((participation: Participation) => ({
          name: participation.year.toString(),
          value: participation.athleteCount
        }))
      };
  
     /* const participationsSeries = {
        name: 'Participations Count',
        series: participations.map((participation: Participation) => ({
          name: participation.year.toString(),
          value: 1// Each participation is counted as 1
        }))
      }*/
  
      return [medalsSeries, athletesSeries];
    }
  private totalAthleteCount(participations: Participation[]) : number {
    return participations.reduce((total, participation) => total + participation.athleteCount, 0);
  }

  private calculateTotalParticipations(participations: Participation[]): number {
    return participations.length;
  }

  private totalMedalCount(participations: Participation[]) : number {
    return participations.reduce((total, participation) => total + participation.medalsCount, 0);
  }
}
