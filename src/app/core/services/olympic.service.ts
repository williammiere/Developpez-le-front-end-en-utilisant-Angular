import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[]>([]);

  constructor(private http: HttpClient) { }

  loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next([]);
        return caught;
      })
    );
  }

  getOlympics(): Observable<Olympic[]> {
    return this.olympics$.asObservable();
  }

  getMedalCountByOlympic(olympic: Olympic): number {
    return olympic.participations.reduce((medalCount, participation) => {
      return medalCount + participation.medalsCount;
    }, 0);
  }

  getOlympicCount(olympics: Olympic[]): number {
    let cities: Set<string> = new Set();
    olympics.forEach((olympic) => {
      olympic.participations.forEach((participation) => {
        cities.add(participation.city);
      });
    });
    return cities.size;
  }

  getAthleteCount(olympic: Olympic): number {
    return olympic.participations.reduce((athleteCount, participation) => {
      return athleteCount + participation.athleteCount;
    }, 0);
  }
}
