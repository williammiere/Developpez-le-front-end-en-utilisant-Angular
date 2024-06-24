import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Olympic} from '../models/Olympic';
import { Participation } from '../models/Participation';
import { Medal } from '../models/medal';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[]>([]);

  constructor(private http: HttpClient) {}

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

  getOlympics() {
    return this.olympics$.asObservable();
  }

  getCountryDetails(id: number): Observable<Olympic | undefined> {
    return this.getOlympics().pipe(
      map((olympics) => olympics?.find(olympic => olympic.id === id))
    );
  }
  
  getCountryByName(name: string): Observable<number | undefined> {
    return this.getOlympics().pipe(
      map((olympics: Olympic[]) => {
        const country = olympics.find(olympic => olympic.country === name);
        return country ? country.id : undefined;
      })
    );
  }

  getTotalParticipations(participations: Participation[]): number {
    return participations.length;
  }
 
}
