import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';

@Injectable({
    providedIn: 'root',
})
export class OlympicService {
    private olympicUrl = './assets/mock/olympic.json';
    private olympics$ = new ReplaySubject<Olympic[]>(1);

    /**
     * Load the data since the service is used.
     * @param http
     */
    constructor(private http: HttpClient) {
        this.loadInitialData();
    }

    /**
     * Load the olympics data. Should disappear once API calls will be used.
     * @private
     */
    private loadInitialData(): void {
        this.http.get<Olympic[]>(this.olympicUrl).pipe(
            tap((value) => this.olympics$.next(value)),
            catchError((error) => {
                this.olympics$.error(error);
                return throwError(() => new Error('Failed to load data'));
            }),
        ).subscribe();
    }

    /**
     * Get the olympics list.
     */
    getOlympics(): Observable<Olympic[]> {
        return this.olympics$.asObservable();
    }

    /**
     * Get the olympics of a country.
     * It checks in the olympics list but it should call an API later.
     * @param country the country (in kebab case)
     * @return the olympic or undefined is no olympic found in the list. Once the API call is implement, it should not return undefined anymore but throw an error instead.
     */
    getOlympicByCountry(country: string): Observable<Olympic | undefined> {
        return this.olympics$.pipe(
            map((arr) =>
                arr.find(
                    (o) =>
                        o.country.toLowerCase().replace(/ /g, '-') ===
                        country.toLowerCase(),
                ),
            ),
        );
    }
}
