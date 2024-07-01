export class PieChartData {
  constructor(
    public name: string,
    public value: number,
    public extra: { [parameter: string]: string },
  ) {}
}
