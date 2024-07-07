import { LineChartSerieData } from './LineChartSerieData';

/**
 * Represents one line in the line chart.
 */
export interface LineChartData {
  name: string;
  series: LineChartSerieData[];
}
