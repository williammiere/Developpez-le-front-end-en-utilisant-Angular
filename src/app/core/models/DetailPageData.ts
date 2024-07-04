import { LineChartData } from './LineChartData';
import { StatsLabel } from './StatsLabel';

/**
 * Represents the detail of a participant.
 */
export class DetailPageData {
  constructor(
    public countryName: string,
    public statsLabels: StatsLabel[],
    public lineChartData: LineChartData[]
  ) {}
}
