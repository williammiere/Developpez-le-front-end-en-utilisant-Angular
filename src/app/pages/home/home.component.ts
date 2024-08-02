import { Component, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { BarChartModule, PieChartModule } from "@swimlane/ngx-charts";
import { JsonPipe } from '@angular/common';
import { Router } from "@angular/router";


@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<Olympic[]> = of([]);
  countryMedals: { "name": string, "value": number }[] = [];
  //  countryMedalsWithCountryIds: { "name": string, "value": number,"extra":{"countryId":string} }[] = [];

  numberOfJOs!: number;
  numberOfCountries!: number;


  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };


  constructor(private olympicService: OlympicService, private router: Router) {
    Object.assign(this, this.countryMedals);
 }/**
 * Initializes the component by loading and processing Olympic data.
 *
 * This method is called when the component is initialized. It performs the following tasks:
 * 1. Subscribes to the `getOlympics` observable from `olympicService` to fetch the list of Olympic entries.
 * 2. For each Olympic entry retrieved:
 *    - Adds an entry to `countryMedals`, including the country name and the total number of medals
 *      obtained by that country, calculated using `getTotalMedalsPerOlympic`.
 *    - Updates `numberOfJOs` with the number of unique years from the participation data, using `getNumberOfJOs`.
 *    - Updates `numberOfCountries` with the number of unique countries in the Olympic data, using `getNumberOfCountries`.
 *
 * @returns {void} No return value.
 */
  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();

    this.olympicService.getOlympics().subscribe(
      (olympics) => {
        if (olympics) {
          olympics.forEach(olympic => {
            this.countryMedals.push({
              name: olympic.country,
              value: this.olympicService.getTotalMedalsPerOlympic(olympic)
            });
            this.numberOfJOs = this.olympicService.getNumberOfJOs();
            this.numberOfCountries = this.olympicService.getNumberOfCountries();
          });
        }
      }
    )

  }
/**
 * Handles the event to navigate to a specific country's Olympic details page.
 *
 * This method searches for an Olympic entry based on the country name provided
 * in the event object. If an Olympic entry matching the country name is found,
 * it retrieves the country's ID and navigates to the details page for that country.
 * If no matching entry is found, it logs an error to the console.
 *
 * @param {CountryEvent} event - The event object containing information about the selected country.
 *                                This object must have a `name` property representing the country name.
 * @returns {void} No return value. Performs navigation based on the country's ID or logs an error.
 */
  onViewCountry(event: any) {
    let countryId: number | undefined;

    let selectedOlympicCountry = this.olympicService.getOlympicsValue().find(
      olympic => olympic.country === event.name
    );
    if (selectedOlympicCountry) {
      countryId = selectedOlympicCountry.id; // Récupérer l'ID du pays
      this.router.navigateByUrl(`/countries/${countryId}`);
    } else {
      console.error('Country not found');
    }

    //

  }
}
