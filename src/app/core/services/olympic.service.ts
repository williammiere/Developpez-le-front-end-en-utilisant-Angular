import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { OlympicParticipant } from '../models/OlympicParticipant';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympicParticipants$ = new BehaviorSubject<OlympicParticipant[]>([]);

  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<OlympicParticipant[]>(this.olympicUrl).pipe(
      tap((value) => this.olympicParticipants$.next(value)),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympicParticipants$.next([]);
        return caught;
      })
    );
  }

  getOlympicParticipants(): Observable<OlympicParticipant[]> {
    return this.olympicParticipants$.asObservable();
  }

  getMedalCountByCountry(participant: OlympicParticipant): number {
    return participant.participations.reduce((medalCount, participation) => {
      return medalCount + participation.medalsCount;
    }, 0);
  }

  getOlympicCount(participant: OlympicParticipant[]): number {
    let cities: Set<string> = new Set();
    participant.forEach((olympic) => {
      olympic.participations.forEach((participation) => {
        cities.add(participation.city);
      });
    });
    return cities.size;
  }

  getAthleteCount(participant: OlympicParticipant): number {
    return participant.participations.reduce((athleteCount, participation) => {
      return athleteCount + participation.athleteCount;
    }, 0);
  }
}
