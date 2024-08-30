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

    constructor(private http: HttpClient) {
        this.loadInitialData().subscribe();
    }

    private loadInitialData(): Observable<Olympic[]> {
        return this.http.get<Olympic[]>(this.olympicUrl).pipe(
            tap((value) => {
                this.olympics$.next(value);
            }),
            catchError((error) => {
                console.error('Erreur lors du chargement des données:', error);
                this.olympics$.next([]);
                return throwError(
                    () => new Error('Erreur lors du chargement des données')
                );
            })
        );
    }

    getOlympics(): Observable<Olympic[]> {
        return this.olympics$.asObservable();
    }

    getOlympicByCountry(country: string): Observable<Olympic | undefined> {
        return this.olympics$.pipe(
            map((arr) =>
                arr.find(
                    (o) =>
                        o.country.toLowerCase().replace(/ /g, '-') ===
                        country.toLowerCase()
                )
            )
        );
    }
}
