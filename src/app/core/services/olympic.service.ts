import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Olympic} from '../models/Olympic';
import { Participation } from '../models/Participation';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[]>([]);

  constructor(private http: HttpClient) {}

  /**
   * Loads initial data from the provided URL and updates the olympics$ subject.
   * If an error occurs, logs the error and sets the olympics$ subject to an empty array.
   * @returns AN Observable of the loaded data
   */
  loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => {this.olympics$.next(value);
        console.log("Bonjour")
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

  /**
   * Return an observable of the current Olympic data
   * @returns  An Observable of the Olympic data
   */
  getOlympics() {
    return this.olympics$.asObservable();
  }

  /**
   * 
   * @param id of the country
   * @returns An observable of the country's details
   */
  getCountryDetails(id: number): Observable<Olympic> {
    return  this.http.get<Olympic[]>(this.olympicUrl).pipe(
      map((olympics) => { 
        console.log(olympics);
    const olympic =  olympics?.find(olympic => olympic.id == id );
    if(!olympic){
      console.error('Country not found:', id);
  throw new Error('Country not found');
    }
    return olympic;
      } )
    )
      }
  
  /**
   * Retrieves the ID of a country by its name.
   * if the country is not found, returns undefined
   * @param name of the country
   * @returns An Observable of the country's ID or undefined
   */    
  getCountryByName(name: string): Observable<number | undefined> {
    return this.getOlympics().pipe(
      map((olympics: Olympic[]) => {
        const country = olympics.find(olympic => olympic.country === name);
        return country ? country.id : undefined;
      })
    );
  }

  /**
   * Calculates the total number of participations for a given array of participations
   * @param participations an array of Participation objects
   * @returns the total number of participation
   */
  getTotalParticipations(participations: Participation[]): number {
    return participations.length;
  }
 
}
