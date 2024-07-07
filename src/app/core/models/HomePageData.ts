import { PieChartData } from './PieChartData';
import { StatsLabel } from './StatsLabel';

/**
 * Represents all the data used in the Home page.
 */
export interface HomePageData {
  statsLabels: StatsLabel[];
  pieChartDataList: PieChartData[];
}
