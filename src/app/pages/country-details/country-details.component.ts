import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { OlympicService } from "../../core/services/olympic.service";
import { Olympic } from "../../core/models/Olympic";
import { NgIf } from "@angular/common";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { partition } from 'rxjs';

@Component({
  selector: 'app-country-details',
  standalone: true,
  imports: [
    NgIf,
    NgxChartsModule
  ],
  templateUrl: './country-details.component.html',
  styleUrl: './country-details.component.scss'
})
export class CountryDetailsComponent implements OnInit {
  onDeactivate($event: any) {
    throw new Error('Method not implemented.');
  }
  onActivate($event: any) {
    throw new Error('Method not implemented.');
  }
  onSelect($event: any): void {
    throw new Error('Method not implemented.');
  }
  olympic!: Olympic;
  medalsPerYear: { "name": string, "series": { "name": string, "value": number }[] }[] = [];
  numberOfEntries!:number;
  totalNumberOfMedals!:number;
  totalNumberOfAthletes!:number;

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
    Object.assign(this, this.medalsPerYear);
    this.numberOfEntries = 0;
    this.totalNumberOfAthletes = 0;
    this.totalNumberOfMedals = 0;

  }

  ngOnInit(): void {
    
    const olympicId = this.route.snapshot.params['id'];

    this.olympicService.getOlympics().subscribe(
      (olympics) => {
        if (olympics) {

          this.olympic = this.olympicService.getOlympicById(Number(olympicId));
          if (this.olympic && this.olympic.country) {
            //this.numberOfEntries =  this.olympicService.getNumberOfEntriesByCountry(this.olympic.country);

            this.olympicService.getParticipationsByCountry(this.olympic.country).subscribe(
              (participations) => {
                if (participations) {
                  let series: { name: string; value: number; }[] = [];
                  participations.forEach(
                    (p) => {
                      series.push({
                        "name": p.year.toString(),
                        "value": p.medalsCount
                      });//end push
                      //this.numberOfEntries ++;
                      

                    });//end foreach participations

                  this.medalsPerYear.push({
                    "name": this.olympic.country,
                    "series": series
                  });
                  this.numberOfEntries = participations.length;
                  this.totalNumberOfMedals = this.olympicService.getTotalMedalsPerOlympic(this.olympic);
                  this.totalNumberOfAthletes = this.olympicService.getTotalAthletesPerOlympic(this.olympic);

                }//end if part

              }
            )
          }

        }
      }
    )



  }


  onGoBackToDashboard() {
    this.router.navigateByUrl(``);

  }
}
