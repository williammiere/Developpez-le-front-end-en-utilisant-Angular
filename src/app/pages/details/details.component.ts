import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable, of, map, takeUntil, Subject } from 'rxjs';
import { NGXData } from 'src/app/core/models/NGXData';
import { NGXLineData } from 'src/app/core/models/NGXLineData';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Router } from '@angular/router';
import { Participation } from 'src/app/core/models/Participation';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
  encapsulation:ViewEncapsulation.None
})
export class DetailsComponent implements OnInit {

  private country$ : Observable<Olympic[]> = of([this.olympicService.getErrorOlympic()]);
  private convertedCountry$ : Observable<NGXLineData[]> = this.convertData();
  private medailNumber: number = 0;
  private countryJo: number = 0;
  private athletesNumber: number = 0;
  public yScaleMax: number = 0; // Just to have a more visible chart
  private destroy$ = new Subject<void>();

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.country$ = this.olympicService.getOlympic(this.router.url.split('country=')[1].replace('%20', ' ')); // Gets the specified country
    this.convertedCountry$ = this.convertData(); // Converts the data to the format needed for the ngx-charts
    this.country$.pipe(takeUntil(this.destroy$)).subscribe(country => { // Gets the number of medals, number of JO and number of athletes for the specified country
      this.medailNumber = this.olympicService.calculCountryMedals(country[0].country);
      this.countryJo = this.olympicService.calculJoCountryNumber(country[0].country);
      this.athletesNumber = this.olympicService.calculAthletesNumber(country[0].country);
    });
    this.calculateYScaleMax();
}

ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}

  private convertData(): Observable<NGXLineData[]> {
    return this.country$.pipe(map(olympics => olympics.map(olympic => ({name: olympic.country, series: this.convertParticipations(olympic.participations)}))));
  }

  private convertParticipations(participations: Participation[]): NGXData[] {
    return participations.map(participation => ({name: participation.year as unknown as string, value: participation.medalsCount}));
  }

  getMedailNumber(): number {
    return this.medailNumber;
  }

  getCountryJo(): number {
    return this.countryJo;
  }

  getAthletesNumber(): number {
    return this.athletesNumber;
  }

  getNGXLineData(): Observable<NGXLineData[]> {
    return this.convertedCountry$;
  }

  getCountry(): Observable<Olympic[]> {
    return this.country$;
  }

  xAxisFormating(value: any): string {
    return value as string;
  }

  private calculateYScaleMax(): void { // Get the maximum amount of medals and multiply it by 1.5
    this.country$.pipe(
      map(olympics => olympics.flatMap(olympic => olympic.participations.map(participation => participation.medalsCount))),
      map(medals => Math.max(...medals) * 1.5)
    ).subscribe(maxValue => {
      this.yScaleMax = maxValue;
    });
  }

}
