import { Component, Input } from '@angular/core';
import { StatsLabel } from 'src/app/core/models/StatsLabel';

@Component({
  selector: 'app-stats-labels-bar',
  standalone: true,
  imports: [],
  templateUrl: './stats-labels-bar.component.html',
  styleUrl: './stats-labels-bar.component.scss'
})
export class StatsLabelsBarComponent {
  @Input() statsLabels!: StatsLabel[];
}
