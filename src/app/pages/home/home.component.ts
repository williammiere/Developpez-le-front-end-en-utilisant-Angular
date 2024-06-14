import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympicMedalCounts$: Observable<Olympic[]> = of([]);


  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympicMedalCounts$ = this.olympicService.getOlympicMedalCounts();
  }
}
