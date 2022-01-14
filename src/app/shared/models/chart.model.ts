export class Chart {
    delay: number;
    addTime: number;
    chart: string[];
  
    constructor(delay: number, addTime:number, chart: string[]) {
      this.delay = delay;
      this.addTime = addTime;
      this.chart = chart;
    }
  }