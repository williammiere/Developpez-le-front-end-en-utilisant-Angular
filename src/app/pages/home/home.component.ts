import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable, of, map } from 'rxjs';
import { NGXData } from 'src/app/core/models/NGXData';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation:ViewEncapsulation.None
})

export class HomeComponent implements OnInit {
  private olympics$: Observable<Olympic[]> = of([this.olympicService.getErrorOlympic()]);
  private convertedOlympics$: Observable<NGXData[]> = this.convertData();
  private joNumber: number = 0;
  private countryNumber: number = 0;

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.convertedOlympics$ = this.convertData();
    this.olympics$.subscribe(olympics => {
      this.countryNumber = olympics.length;
      this.joNumber = this.calculJoNumber();
  });
}

  private convertData(): Observable<NGXData[]> {
    return this.olympics$.pipe(map(olympics => olympics.map(olympic => ({name: olympic.country, value: this.calculCountryMedals(olympic.country)}))));
  }

  getNGXData(): Observable<NGXData[]> {
    return this.convertedOlympics$;
  }

  onSelect(event: any): void {
    const country = event.name;
    this.router.navigate(['/details'], {queryParams:{country: country}});
  }

  calculCountryMedals(country:string): number {
    var medals = 0;
    const countryMedals = this.olympics$.pipe(
      map(olympics => olympics.map(olympic => ({
      name: olympic.country,
      medalsCount: olympic.participations.reduce((total, participation) => total + participation.medalsCount, 0)
      })))
    );

    countryMedals.forEach(countryMedals => {
      countryMedals.forEach(countryMedal => {
        if (countryMedal.name === country) {
          medals = countryMedal.medalsCount;
        }
      });
    });

    return medals;

  }

  calculJoNumber(): number {
    var jos = 0;
    var uniqueJo:number[] = [];
    const participations = this.olympics$.pipe(map(olympics => olympics.map(olympic => olympic.participations)));
    participations.forEach(participations => {
      participations.forEach(participation => {
        participation.forEach(part => {
          if (!uniqueJo.includes(part.year)) {
            uniqueJo.push(part.year);
            jos++;
          }
        }
        )
      });
    });
    return jos;
  }

  getCountryNumber(): number {
    return this.countryNumber;
  }

  getJoNumber(): number {
    return this.joNumber;
  }
}
