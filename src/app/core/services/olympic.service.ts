import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';
import { Participation } from '../models/Participation';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {

  getNumberOfEntriesByCountry(country: string): Observable<Participation[]> {
    return this.getParticipationsByCountry(country);

  }
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[]>([]);

  constructor(private http: HttpClient) {
    this.loadInitialData().subscribe();
  }

  loadInitialData(): Observable<void> {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error) => {
        console.error(error);
        this.olympics$.next([]);
        return throwError(() => new Error('Failed to load initial Olympic data'));
      }),
      map(() => void 0)
    );
  }

  getOlympics(): Observable<Olympic[]> {
    return this.olympics$.asObservable();
  }

  getOlympicsValue(): Olympic[] {
    return this.olympics$.value;
  }

  getOlympicByCountry(country: string): Observable<Olympic> {
    const foundOlympic = this.getOlympicsValue().find((olympic) => olympic.country === country);
    if (!foundOlympic) {
      return throwError(() => new Error(`Could not find Olympic with country ${country}`));
    }
    return of(foundOlympic);
  }

  getParticipationsByCountry(country: string): Observable<Participation[]> {
    return this.getOlympicByCountry(country).pipe(
      map((olympic) => olympic.participations),
      catchError((error) => {
        console.error(error);
        return throwError(() => new Error(`Failed to get participations for country ${country}`));
      })
    );
  }

  getOlympicById(olympicId: number): Olympic   {
    const foundOlympic = this.getOlympicsValue().find((olympic) => olympic.id === olympicId);
    if (!foundOlympic) {
      throw new Error(`Could not find Olympic with id ${olympicId}`);
    }
    return foundOlympic;
  }

  getTotalMedalsPerOlympic(olympic: Olympic): number {
    return olympic.participations.reduce((total, participation) => total + participation.medalsCount, 0);
  }
  getTotalAthletesPerOlympic(olympic: Olympic): number{
    return olympic.participations.reduce((total, participation) => total + participation.athleteCount,0);
  }

  getNumberOfJOs(): number {
    const olympics = this.olympics$.getValue();
    const uniqueYears = new Set<number>();
    olympics.forEach((olympic) => {
      olympic.participations.forEach((participation) => {
        uniqueYears.add(participation.year);
      });
    });
    return uniqueYears.size;
  }

  getNumberOfCountries(): number {
    const olympics = this.olympics$.getValue();
    const uniqueCountries = new Set<string>();
    olympics.forEach((olympic) => {
      uniqueCountries.add(olympic.country);
    });
    return uniqueCountries.size;
  }
}
