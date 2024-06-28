import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, of, partition } from 'rxjs';
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


  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.totalMedals();
  }

  ngOnDestroy(){
  
  }

  //nombre total de médailles par pays
  totalMedals(): void{
    this.olympicService.getOlympics().subscribe( olympics=>{
     this.countriesLength = olympics.length;
    this.totalEntries = this.totalParticipations(olympics);
     this.medals =  olympics.map((olympic: Olympic) => ({
          name: olympic.country,
          value: olympic.participations.reduce((acc: number, participation: Participation) => acc + participation.medalsCount, 0)}))})
  }

  //Récupère le nombre total de participâtion.
  totalParticipations(olympics: Olympic[]): number {
    const participations: Participation[] =  olympics.flatMap((olympic: Olympic) => olympic.participations);
    const cities: string[] = participations.map((partition: Participation) =>partition.city);
    return new Set(cities).size;
  }        


  //récupère l'ID lorsqu'on clique sur le nom
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
