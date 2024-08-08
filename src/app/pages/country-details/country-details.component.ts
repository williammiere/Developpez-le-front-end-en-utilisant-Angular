import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { OlympicService } from "../../core/services/olympic.service";
import { Olympic } from "../../core/models/Olympic";
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-country-details',

  templateUrl: './country-details.component.html',
  styleUrl: './country-details.component.scss'
})
export class CountryDetailsComponent implements OnInit, OnDestroy {

  olympic!: Olympic;
  private olympicsSubscription: Subscription | undefined;

  medalsPerYear: { "name": string, "series": { "name": string, "value": number }[] }[] = [];
  numberOfEntries!: number;
  totalNumberOfMedals!: number;
  totalNumberOfAthletes!: number;

  // options
  legend: boolean = false;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Dates';
  yAxisLabel: string = '';
  timeline: boolean = true;
  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  constructor(private router: Router,
    private olympicService: OlympicService,
    private route: ActivatedRoute) {
    this.numberOfEntries = 0;
    this.totalNumberOfAthletes = 0;
    this.totalNumberOfMedals = 0;

  }
  /**
   * Initializes the component and loads Olympic data for a specific country.
   *
   * This method is triggered when the component is initialized. It performs the following tasks:
   * 1. Retrieves the Olympic ID from the route parameters.
   * 2. Fetches the list of all Olympics using the OlympicService.
   * 3. Finds and assigns the Olympic details for the specific country based on the retrieved Olympic ID.
   * 4. If Olympic data is found, it:
   *    - Retrieves participation data for the country.
   *    - Maps the participation data to a format suitable for displaying medals per year.
   *    - Updates the total number of entries, medals, and athletes based on the retrieved data.
   *
   * @returns {void} No return value.
   */
  ngOnInit(): void {
    const olympicId: number = Number(this.route.snapshot.params['id']);
    this.olympicsSubscription = this.olympicService.getOlympics().subscribe(
      (olympics) => {
        if (olympics) {
          if (olympicId) {
            const foundOlympic = olympics.find((olympic) => olympic.id === olympicId);

            if (foundOlympic) {
              this.olympic = foundOlympic;

              this.olympicService.getParticipationsByCountryId(olympicId).subscribe(
                (participations) => {
                  if (participations) {
                    let series: { name: string; value: number; }[] = [];
                    participations.forEach(
                      (p) => {
                        series.push({
                          "name": p.year.toString(),
                          "value": p.medalsCount
                        });//end push
                      });//end foreach participations

                    this.medalsPerYear.push({
                      "name": foundOlympic.country,
                      "series": series
                    });
                    this.numberOfEntries = participations.length;
                    this.totalNumberOfMedals = this.olympicService.getTotalMedalsPerOlympic(foundOlympic);
                    this.totalNumberOfAthletes = this.olympicService.getTotalAthletesPerOlympic(foundOlympic);

                  }//end if part

                });
              }else {
                  console.error('Country not found for the given countryId');
                }
              
            }

          }
        });


  }

  /**
   * Navigates the user back to the dashboard.
   *
   * This method uses Angular's Router to navigate back to the
   * dashboard or a specified route. The exact route is determined
   * by the URL provided.
   *
   * @returns {void} No return value.
   */
  onGoBackToDashboard(): void {
    this.router.navigateByUrl(``);

  }

  ngOnDestroy(): void {
    this.olympicsSubscription?.unsubscribe();
  }
}
