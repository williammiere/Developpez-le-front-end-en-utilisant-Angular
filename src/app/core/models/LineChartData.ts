import { LineChartSerieData } from './LineChartSerieData';

/**
 * Represents one line in the line chart.
 */
export class LineChartData {
  constructor(public name: string, public series: LineChartSerieData[]) {}
}
