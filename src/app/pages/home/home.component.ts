import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import {BarChartModule, PieChartModule} from "@swimlane/ngx-charts";
import { JsonPipe } from '@angular/common';




@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<Olympic[]> = of([]);
  countryMedals: { "name": string, "value": number }[] = [];
  numberOfJOs!:number;


  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };


  constructor(private olympicService:OlympicService) {

    Object.assign(this, this.countryMedals);


  }

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
          });
        }
      }
    )
    this.numberOfJOs = this.olympicService.getNumberOfJOs();
  }

 //

}
