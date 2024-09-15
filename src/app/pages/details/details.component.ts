import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable, of, map } from 'rxjs';
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

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.country$ = this.olympicService.getOlympic(this.router.url.split('country=')[1].replace('%20', ' '));
    this.convertedCountry$ = this.convertData();
}

  private convertData(): Observable<NGXLineData[]> {
    return this.country$.pipe(map(olympics => olympics.map(olympic => ({name: olympic.country, series: this.convertParticipations(olympic.participations)}))));
  }

  private convertParticipations(participations: Participation[]): NGXData[] {
    return participations.map(participation => ({name: participation.year as unknown as string, value: participation.medalsCount}));
  }

  public getNGXLineData(): Observable<NGXLineData[]> {
    return this.convertedCountry$;
  }

  public getCountry(): Observable<Olympic[]> {
    return this.country$;
  }

}
