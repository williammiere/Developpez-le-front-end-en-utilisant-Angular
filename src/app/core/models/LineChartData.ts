export class LineChartSerieData {
  constructor(
    public value: number,
    public name: string,
  ) {}
}

export class LineChartData {
  constructor(
    public name: string,
    public series: LineChartSerieData[],
  ) {}
}
