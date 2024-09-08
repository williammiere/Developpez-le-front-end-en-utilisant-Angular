import { Component, OnInit } from '@angular/core';
import { Observable, of, map } from 'rxjs';
import { NGXData } from 'src/app/core/models/NGXData';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit {
  private olympics$: Observable<Olympic[]> = of([this.olympicService.getErrorOlympic()]);
  private convertedOlympics$: Observable<NGXData[]> =this.convertData();

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.convertedOlympics$ = this.olympics$.pipe(map(olympics => olympics.map(olympic => ({name: olympic.country, value: olympic.participations.length}))));
  }

  private convertData(): Observable<NGXData[]> {
    return this.olympics$.pipe(map(olympics => olympics.map(olympic => ({name: olympic.country, value: olympic.participations.length}))));
  }

  getNGXData(): Observable<NGXData[]> {
    return this.convertedOlympics$;
  }

  onSelect(event: any): void {
    const country = event.name;
    this.router.navigate(['/details', country]);
  }
}
