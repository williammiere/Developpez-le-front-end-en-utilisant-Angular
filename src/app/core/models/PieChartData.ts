/**
 * Represents a slice in the pie chart.
 * A slice representing the medal count of a country.
 */
export class PieChartData {
  constructor(
    public name: string,
    public value: number,
    public extra: { [parameter: string]: string }
  ) {}
}
