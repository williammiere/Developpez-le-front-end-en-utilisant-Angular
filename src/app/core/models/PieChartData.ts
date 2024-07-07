/**
 * Represents a slice in the pie chart.
 * A slice representing the medal count of a country.
 */
export interface PieChartData {
  name: string;
  value: number;
  extra: { [parameter: string]: string };
}
