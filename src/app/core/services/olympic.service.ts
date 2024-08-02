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

  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[]>([]);

  constructor(private http: HttpClient) {
    this.loadInitialData().subscribe();
  }
  /**
   * Loads the initial Olympic data from the server and updates the local state.
   *
   * This method sends an HTTP GET request to fetch Olympic data from a predefined URL.
   * Upon receiving the data, it updates the local observable `olympics$` with the fetched data.
   * If an error occurs during the HTTP request, it logs the error, sets the observable to an empty array,
   * and throws an error indicating that the data loading failed.
   *
   * @returns {Observable<void>} An observable that completes when the data loading process is done.
   * The observable emits `void` because the side effects (updating `olympics$`) are the main purpose of this method.
   */
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
  /**
   * Retrieves an observable of the current Olympic data.
   *
   * This method returns an observable that emits the current state of the Olympic data
   * from the `olympics$` subject. This allows subscribers to react to changes in the
   * Olympic data over time.
   *
   * @returns {Observable<Olympic[]>} An observable that emits an array of `Olympic` objects.
   * The observable reflects the current value held by the `olympics$` subject.
   */
  getOlympics(): Observable<Olympic[]> {
    return this.olympics$.asObservable();
  }

  getOlympicsValue(): Olympic[] {
    return this.olympics$.value;
  }
  /**
   * Retrieves an Olympic object for a specific country.
   *
   * This method searches the current list of Olympic data for an entry that matches
   * the specified country. If an Olympic entry is found, it is returned as an observable.
   * If no matching entry is found, the method returns an observable error indicating
   * that no Olympic data could be found for the given country.
   *
   * @param {string} country - The name of the country for which to retrieve the Olympic data.
   * @returns {Observable<Olympic>} An observable emitting the `Olympic` object corresponding
   * to the specified country. If no matching Olympic data is found, an error observable is returned.
   */
  getOlympicByCountry(country: string): Observable<Olympic> {
    const foundOlympic = this.getOlympicsValue().find((olympic) => olympic.country === country);
    if (!foundOlympic) {
      return throwError(() => new Error(`Could not find Olympic with country ${country}`));
    }
    return of(foundOlympic);
  }
  /**
   * Retrieves participation data for a specific country from the current Olympic data.
   *
   * This method first retrieves the Olympic data for the given country using the
   * `getOlympicByCountry` method. It then extracts and returns the participations
   * associated with that Olympic entry. If an error occurs while fetching the
   * Olympic data, it logs the error and returns an observable that emits an error
   * indicating the failure to retrieve the participation data.
   *
   * @param {string} country - The name of the country for which to retrieve participation data.
   * @returns {Observable<Participation[]>} An observable emitting an array of `Participation` objects.
   * If an error occurs, the observable will emit an error indicating the failure to retrieve the data.
   */
  getParticipationsByCountry(country: string): Observable<Participation[]> {
    return this.getOlympicByCountry(country).pipe(
      map((olympic) => olympic.participations),
      catchError((error) => {
        console.error(error);
        return throwError(() => new Error(`Failed to get participations for country ${country}`));
      })
    );
  }
  /**
   * Retrieves an Olympic object by its ID.
   *
   * This method searches the current list of Olympic data for an entry that matches
   * the specified Olympic ID. If an Olympic entry with the given ID is found, it is returned.
   * If no matching entry is found, an error is thrown indicating that no Olympic data
   * could be found for the specified ID.
   *
   * @param {number} olympicId - The ID of the Olympic entry to retrieve.
   * @returns {Olympic} The `Olympic` object corresponding to the specified ID.
   * @throws {Error} Throws an error if no Olympic entry with the given ID is found.
   */
  getOlympicById(olympicId: number): Olympic {
    const foundOlympic = this.getOlympicsValue().find((olympic) => olympic.id === olympicId);
    if (!foundOlympic) {
      throw new Error(`Could not find Olympic with id ${olympicId}`);
    }
    return foundOlympic;
  }
  /**
   * Calculates the total number of medals for a given Olympic entry.
   *
   * This method sums up the `medalsCount` from all participations associated
   * with the provided Olympic entry to determine the total number of medals.
   *
   * @param {Olympic} olympic - The Olympic entry for which to calculate the total medals.
   * @returns {number} The total number of medals across all participations for the given Olympic entry.
   */
  getTotalMedalsPerOlympic(olympic: Olympic): number {
    return olympic.participations.reduce((total, participation) => total + participation.medalsCount, 0);
  }

  /**
   * Calculates the total number of athletes for a given Olympic entry.
   *
   * This method sums up the `athleteCount` from all participations associated
   * with the provided Olympic entry to determine the total number of athletes.
   *
   * @param {Olympic} olympic - The Olympic entry for which to calculate the total athletes.
   * @returns {number} The total number of athletes across all participations for the given Olympic entry.
   */
  getTotalAthletesPerOlympic(olympic: Olympic): number {
    return olympic.participations.reduce((total, participation) => total + participation.athleteCount, 0);
  }
  /**
   * Determines the number of unique years in which Olympic participations occurred.
   *
   * This method collects all unique years from the participation data across all
   * Olympic entries and returns the count of these unique years.
   *
   * @returns {number} The number of unique years present in the participation data of all Olympic entries.
   */
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
  /**
   * Determines the number of unique countries represented in the Olympic data.
   *
   * This method collects all unique countries from the Olympic entries and returns
   * the count of these unique countries.
   *
   * @returns {number} The number of unique countries present in the Olympic data.
   */
  getNumberOfCountries(): number {
    const olympics = this.olympics$.getValue();
    const uniqueCountries = new Set<string>();
    olympics.forEach((olympic) => {
      uniqueCountries.add(olympic.country);
    });
    return uniqueCountries.size;
  }
}
