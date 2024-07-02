import { LineChartSerieData } from "./LineChartSerieData";

export class LineChartData {
  constructor(
    public name: string,
    public series: LineChartSerieData[],
  ) {}
}
