import { LineChartData } from './LineChartData';
import { StatsLabel } from './StatsLabel';

/**
 * Represents the detail of a participant.
 */
export interface DetailPageData {
  countryName: string;
  statsLabels: StatsLabel[];
  lineChartData: LineChartData[];
}
