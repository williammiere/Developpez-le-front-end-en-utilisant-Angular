import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { catchError, filter, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private errorOlympic = {id: -1, country: 'Error', participations: []};
  private olympics$ = new BehaviorSubject<Olympic[]>([this.errorOlympic]);

  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next([this.errorOlympic]);
        return caught;
      })
    );
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }

  getOlympic(id: string): Observable<Olympic[]> {
      const olympics = this.getOlympics();
      const olympic = olympics.pipe(
        filter(olympics => olympics.some(olympic => olympic.country === id)), // Vérifie si au moins un élément satisfait la condition
        map(olympics => olympics.filter(olympic => olympic.country === id)) // Filtre les éléments pour ne garder que ceux qui satisfont la condition
      );
      return olympic;
  }

  getErrorOlympic() {
    return this.errorOlympic;
  }

  calculCountryMedals(country:string): number {
    console.log(country);
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

  calculJoCountryNumber(country:string): number {
    var jos = 0;
    var uniqueJo: number[] = [];
    const countryParticipations = this.olympics$.pipe(
      map(olympics => olympics.find(olympic => olympic.country === country)),
      map(olympic => olympic ? olympic.participations : [])
    );

    countryParticipations.subscribe(participations => {
      participations.forEach(part => {
      if (!uniqueJo.includes(part.year)) {
        uniqueJo.push(part.year);
        jos++;
      }
      });
    });
    return jos;
  }

  calculAthletesNumber(country:string): number {
    let athletes = 0;
    const countryParticipations = this.olympics$.pipe(
      map(olympics => olympics.find(olympic => olympic.country === country)),
      map(olympic => olympic ? olympic.participations : [])
    );

    countryParticipations.subscribe(participations => {
      athletes = participations.reduce((total, participation) => total + participation.athleteCount, 0);
    });
    return athletes;
  }
}
