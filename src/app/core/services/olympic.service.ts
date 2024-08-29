import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';
import { OlympicCountry } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<OlympicCountry[]>([]);
  private totalOfMedal: number = 0;

  constructor(private http: HttpClient) {}

  loadInitialData(): Observable<OlympicCountry[]> {
    return this.http.get<OlympicCountry[]>(this.olympicUrl).pipe(
      take(1),
      tap((olympicCountries) => {
        this.olympics$.next(olympicCountries);
        olympicCountries.forEach(olympicCountry => {
          for (let index = 0; index < olympicCountry.participations.length; index++) {
            this.totalOfMedal += olympicCountry.participations[index].medalsCount;
          }
          olympicCountry.totalOfMedal = this.totalOfMedal;
          this.totalOfMedal = 0;
        })
      }),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next([]);
        return caught;
      })
    );
  }

  getOlympics(): Observable<OlympicCountry[]> {
    return this.olympics$.asObservable();
  }
}
