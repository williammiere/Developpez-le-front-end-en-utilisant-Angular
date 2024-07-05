import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Color, ScaleType,} from '@swimlane/ngx-charts';
import { Observable, Subscription,} from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { Participation } from 'src/app/core/models/Participation';
import { StatCountry } from 'src/app/core/models/statcounrty';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {

  countryId: number | null = null;
  countryDetails$: Observable<Olympic | undefined> | undefined;
  lineChartData!: StatCountry[];
  totalParticipations: number = 0;
  totalAthletes!: number;
  medalLenght!: number;
  colorScheme: Color = {
    name: 'cool',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C']
  };
  olympicSubscription!: Subscription;
  countryName!: string;

  
  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {

    const idCountry: number = this.route.snapshot.params['id'];
    this.olympicSubscription = this.olympicService.getCountryDetails(idCountry).subscribe({
      next: (country: Olympic) => {
        this.lineChartData = this.transformToLineChartData(country.participations);
        this.totalAthletes = this.totalAthleteCount(country.participations);
        this.totalParticipations = this.calculateTotalParticipations(country.participations);
        this.countryName = country.country;
        this.medalLenght = this.totalMedalCount(country.participations);
      },
      error: (error: Error) => this.router.navigate(['/not-found'])   
    })
  
  }

  ngOnDestroy(){
    this.olympicSubscription.unsubscribe();
  }

  /**
   * Transforms participations into data for the line chart.
   * @param participations list participations 
   * @returns an array of data series for the chart. 
   */
  private transformToLineChartData(participations: Participation[]): StatCountry[] {
    const medalsSeries: StatCountry = {
      name: 'Medals Count',
      series: participations.map((participation: Participation) => ({
        name: participation.year.toString(),
        value: participation.medalsCount
      }))
    };
      
    const athletesSeries: StatCountry = {
      name: 'Athlete Count',
      series: participations.map((participation: Participation) => ({
        name: participation.year.toString(),
        value: participation.athleteCount
      }))
    };
  
    return [medalsSeries, athletesSeries];
  }

  /**
   * Calculates the total number of athletes
   * @param participations list of participations
   * @returns the total number of athletes
   */
  private totalAthleteCount(participations: Participation[]) : number {
    return participations.reduce((total, participation) => total + participation.athleteCount, 0);
  }

  /**
   * Calculates the total number of participations.
   * @param participations list of participations
   * @returns the total number of participations.
   */
  private calculateTotalParticipations(participations: Participation[]): number {
    return participations.length;
  }

  /**
   * Calculates the total number of medals.
   * @param participations list of participations
   * @returns the total number of medals.
   */
  private totalMedalCount(participations: Participation[]) : number {
    return participations.reduce((total, participation) => total + participation.medalsCount, 0);
  }
}
