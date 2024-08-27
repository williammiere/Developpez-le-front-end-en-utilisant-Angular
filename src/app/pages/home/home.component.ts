import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<OlympicCountry[]> = of([]);
  private totalOfMedal: number = 0;

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();

    this.olympics$.forEach(olympicCountries => {
      olympicCountries.forEach(olympicCountry => {
        for (let index = 0; index < olympicCountry.participations.length; index++) {
          this.totalOfMedal += olympicCountry.participations[index].medalsCount;
        }
        olympicCountry.totalOfMedal = this.totalOfMedal;
        this.totalOfMedal = 0;
      });
    });
  }
}
