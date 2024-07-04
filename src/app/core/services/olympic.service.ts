import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, filter, map, tap } from 'rxjs/operators';
import { OlympicParticipant } from '../models/OlympicParticipant';

/**
 * Service handling the olympic games.
 */
@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympicParticipants$ = new BehaviorSubject<OlympicParticipant[]>([]);

  constructor(private http: HttpClient) {}

  loadInitialData(): Observable<OlympicParticipant[]> {
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

  /**
   * Get the observable which handle
   * a given participant.
   * 
   * @param participantId id of the given participant
   * @returns the observable handling a participant
   */
  getOlympicParticipant(participantId: string): Observable<OlympicParticipant | undefined> {
    return this.getOlympicParticipants().pipe(
      map(participants => participants.find((participant) => participant.id == participantId)
      )
      ,filter(particant => particant != undefined)
    );
  }

  /**
   * Returns the number of olympic games.
   *
   * @param participant the list of participating countries
   * @returns the number of olympic games.
   */
  getOlympicCount(participant: OlympicParticipant[]): number {
    let cities: Set<string> = new Set();
    participant.forEach((olympic) => {
      olympic.participations.forEach((participation) => {
        cities.add(participation.city);
      });
    });
    return cities.size;
  }

  /**
   * Returns the total number of athletes of a country,
   * who participated to olympic games.
   *
   * @param participant the participating country.
   * @returns the athlete count of each participation of the country.
   */
  getAthleteCount(participant: OlympicParticipant): number {
    return participant.participations.reduce((athleteCount, participation) => {
      return athleteCount + participation.athleteCount;
    }, 0);
  }

  /**
   * Returns the number of medal earned by
   * a country for all olympic games.
   *
   * @param participant the participating country.
   * @returns the medal count of each participation of the country.
   */
  getMedalCount(participant: OlympicParticipant): number {
    return participant.participations.reduce((medalCount, participation) => {
      return medalCount + participation.medalsCount;
    }, 0);
  }
}
