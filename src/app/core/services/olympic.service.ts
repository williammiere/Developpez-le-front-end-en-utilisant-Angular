import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, filter, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private errorOlympic = {id: -1, country: 'Error', participations: []};
  private olympics$ = new BehaviorSubject<Olympic[]>([this.errorOlympic]);

  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next([this.errorOlympic]);
        return caught;
      })
    );
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }

  getOlympic(id: string): Observable<Olympic[]> {
      const olympics = this.getOlympics();
      const olympic = olympics.pipe(
          filter(olympics => olympics.find(olympic => olympic.country === id) !== undefined)
      );
      return olympic;
  }

  getErrorOlympic() {
    return this.errorOlympic;
  }
}
