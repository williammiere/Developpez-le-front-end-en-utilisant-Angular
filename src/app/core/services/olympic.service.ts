import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, throwError } from 'rxjs';
import { catchError, filter, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';
import { ErrorService } from './error.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private errorOlympic = {id: -1, country: 'Error', participations: []};
  private olympics$ = new BehaviorSubject<Olympic[]>([this.errorOlympic]);

  constructor(private http: HttpClient, private errorService:ErrorService, private router:Router) {}

  loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        // TODO: improve error handling
        alert('An error occurred while loading the data. Check your connection or try again later.');
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next([this.errorOlympic]);
        return throwError(() => this.errorService.setMessageError());
      })
    );
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }

  getOlympic(id: string): Observable<Olympic[]> {
      const olympics = this.getOlympics();
      const olympic = olympics.pipe(
        map(olympics => olympics.filter(olympic => olympic.country === id)) // Gets the element
      );
      return olympic;
  }

  getErrorOlympic() {
    return this.errorOlympic;
  }

  calculCountryMedals(country:string): number { // Calculates the number of medals for a country
    var medals = 0;
    const countryMedals = this.olympics$.pipe( // Gets the number of medals for each country
      map(olympics => olympics.map(olympic => ({
      name: olympic.country,
      medalsCount: olympic.participations.reduce((total, participation) => total + participation.medalsCount, 0) // Sums the number of medals for each participation
      })))
    );
    
    countryMedals.forEach(countryMedals => { // Gets the number of medals for the specified country
      countryMedals.forEach(countryMedal => {
        if (countryMedal.name === country) {
          medals = countryMedal.medalsCount;
        }
      });
    });
    return medals;
}

  calculJoNumber(): number { // Calculates the total number of JOs
    var jos = 0;
    var uniqueJo:number[] = [];
    const participations = this.olympics$.pipe(map(olympics => olympics.map(olympic => olympic.participations))); // Gets the participations from each country
    participations.forEach(participations => { // Gets the number of JOs of each country
      participations.forEach(participation => {
        participation.forEach(part => {
          if (!uniqueJo.includes(part.year)) { // Verifies if the JO already exists by checking if the year is already in the array
            uniqueJo.push(part.year);
            jos++;
          }
        }
        )
      });
    });
    return jos;
  }

  calculJoCountryNumber(country:string): number { // Calculates the number of JOs for a country
    var jos = 0;
    var uniqueJo: number[] = [];
    const countryParticipations = this.olympics$.pipe( // Gets the participations of the specified country
      map(olympics => olympics.find(olympic => olympic.country === country)),
      map(olympic => olympic ? olympic.participations : [])
    );

    countryParticipations.subscribe(participations => { // counts the number of participations
      participations.forEach(part => {
      if (!uniqueJo.includes(part.year)) {
        uniqueJo.push(part.year);
        jos++;
      }
      });
    });
    return jos;
  }

  calculAthletesNumber(country:string): number { // Calculates the number of athletes for a country
    let athletes = 0;
    const countryParticipations = this.olympics$.pipe( // Gets the participations of the specified country
      map(olympics => olympics.find(olympic => olympic.country === country)),
      map(olympic => olympic ? olympic.participations : [])
    );

    countryParticipations.subscribe(participations => {
      athletes = participations.reduce((total, participation) => total + participation.athleteCount, 0); // Sums the number of athletes for each participation
    });
    return athletes;
  }
}
