import { Component, Input, SimpleChanges } from '@angular/core';

import { ChartData, Color } from 'chart.js';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: [
  ]
})
export class DonaComponent {

  @Input() titulo: string = '';
  @Input() labels: string[] = ['Label 1', 'Label 2', 'Label 3'];
  @Input() data = [];

  // Definimos los colores para cada una de las entradas
  public colors: Color[] = [
    '#6857E6',
    '#009FEE',
    '#F02059'
  ];

  // Doughnut
  public doughnutChartLabels: string[] = this.labels;
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      { data: [0, 0, 0] }
    ]
  };

  ngOnChanges(changes: SimpleChanges): void {
    this.doughnutChartData = {
      labels: this.labels,
      datasets: this.data
    }
  }

}
