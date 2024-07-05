import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription, map, of, partition } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { Participation } from 'src/app/core/models/Participation';
import { Medal } from 'src/app/core/models/medal';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympicEntries$: Observable<Olympic[]> = of([]);
  countriesLength!: number;
  totalEntries: number = 0;
  medals:  Medal[] = [];
  olympicServiceSubscription!: Subscription;


  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.initChartdata();
  }

  ngOnDestroy(){
    this.olympicServiceSubscription.unsubscribe();
  }

  /**
   * Calculates the total number of medals for each country.
   * Subscribes to the OlympicService to get the Olympics data,
   * then maps it to the medals array.
   */
  private initChartdata(): void{
   this.olympicServiceSubscription =  this.olympicService.getOlympics().subscribe( olympics=>{
     this.countriesLength = olympics.length;
    this.totalEntries = this.totalParticipations(olympics);
     this.medals =  olympics.map((olympic: Olympic) => ({
          name: olympic.country,
          value: olympic.participations.reduce((acc: number, participation: Participation) => acc + participation.medalsCount, 0)}))})
  }

  
  /**
   * Calculates the total number of unique participations in the Olympic games.
   * @param olympics olympic list
   * @returns  total number of olympics game participation
   */
  private totalParticipations(olympics: Olympic[]): number {
    const participations: Participation[] =  olympics.flatMap((olympic: Olympic) => olympic.participations);
    const cities: string[] = participations.map((partition: Participation) =>partition.city);
    return new Set(cities).size;
  }        


  
  /**
   * Retrieves the country ID by its name and navigates to the detail page if the ID is found.
   * Logs an error if the country ID is not found.
   * @param event containing the selected country's name
   */
  onCountrySelect(event: Medal): void {
    const countryName = event.name;
    this.olympicService.getCountryByName(countryName).subscribe((id) => {
      if (id !== undefined) {
        this.router.navigate(['/detail', id]);
      } else {
        console.error('Country ID not found');
      }
    });
  }
  

}
