import { PieChartData } from './PieChartData';
import { StatsLabel } from './StatsLabel';

/**
 * Represents all the data used in the Home page.
 */
export class HomePageData {
  constructor(
    public statsLabels: StatsLabel[],
    public pieChartDataList: PieChartData[]
  ) {}
}
