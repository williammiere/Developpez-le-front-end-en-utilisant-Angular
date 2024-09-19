import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable, of, map } from 'rxjs';
import { NGXData } from 'src/app/core/models/NGXData';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation:ViewEncapsulation.None
})

export class HomeComponent implements OnInit {
  private olympics$: Observable<Olympic[]> = of([this.olympicService.getErrorOlympic()]);
  private convertedOlympics$: Observable<NGXData[]> = this.convertData();
  private joNumber: number = 0;
  private countryNumber: number = 0;

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.convertedOlympics$ = this.convertData();
    this.olympics$.subscribe(olympics => {
      this.countryNumber = olympics.length;
      this.joNumber = this.olympicService.calculJoNumber();
  });
}

  private convertData(): Observable<NGXData[]> {
    return this.olympics$.pipe(map(olympics => olympics.map(olympic => ({name: olympic.country, value: this.olympicService.calculCountryMedals(olympic.country)}))));
  }

  getNGXData(): Observable<NGXData[]> {
    return this.convertedOlympics$;
  }

  onSelect(event: any): void {
    const country = event.name;
    this.router.navigate(['/details'], {queryParams:{country: country}});
  }

  getCountryNumber(): number {
    return this.countryNumber;
  }

  getJoNumber(): number {
    return this.joNumber;
  }
}
