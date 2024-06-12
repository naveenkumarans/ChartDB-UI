import { Component, OnInit, Input, OnChanges, ElementRef, ViewChild, SimpleChanges, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
import { DataServiceService } from '../data-service.service';
declare var google: any;

@Component({
  selector: 'app-chart-component',
  templateUrl: './chart-component.component.html',
  styleUrls: ['./chart-component.component.css']
})
export class ChartComponentComponent implements OnChanges, AfterViewInit {
  @Input() filteredData: any[];
  @ViewChild('chartContainer', { static: true }) chartContainer: ElementRef;
  selectedChartType: string = 'bar';
  selectedXAxis: string = 'topic';
  selectedYAxis: string = 'intensity';
  dataKeys: string[] = [];

  constructor() {
    google.charts.load('current', { packages: ['corechart'] });
  }

  ngAfterViewInit(): void {
    google.charts.setOnLoadCallback(this.createChart.bind(this));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.filteredData) {
      this.extractDataKeys();
      this.createChart();
    }
  }

  extractDataKeys(): void {
    if (this.filteredData && this.filteredData.length > 0) {
      this.dataKeys = Object.keys(this.filteredData[0]);
    }
  }

  createChart(): void {
    if (!this.chartContainer) {
      console.error('Chart container not initialized');
      return;
    }

    const element = this.chartContainer.nativeElement;
    if (!element) {
      console.error('Chart container element not found');
      return;
    }

    const data = this.filteredData;
    const chartData = this.getChartData(data);
    const options = {
      title: 'Chart',
      hAxis: {
        title: this.selectedXAxis,
      },
      vAxis: {
        title: this.selectedYAxis,
      },
    };

    let chart;
    switch (this.selectedChartType) {
      case 'pie':
        chart = new google.visualization.PieChart(element);
        break;
      case 'line':
        chart = new google.visualization.LineChart(element);
        break;
      case 'scatter':
        chart = new google.visualization.ScatterChart(element);
        break;
      case 'bar':
      default:
        chart = new google.visualization.BarChart(element);
        break;
    }

    chart.draw(chartData, options);
  }

  getChartData(data): any {
    const chartData = new google.visualization.DataTable();
    const xType = this.getColumnType(data[0][this.selectedXAxis]);
    const yType = this.getColumnType(data[0][this.selectedYAxis]);

    chartData.addColumn(xType, this.selectedXAxis);
    chartData.addColumn(yType, this.selectedYAxis);

    data.forEach(d => {
      const xValue = this.parseValue(d[this.selectedXAxis], xType);
      const yValue = this.parseValue(d[this.selectedYAxis], yType);
      if (xValue !== null && yValue !== null) {
        chartData.addRow([xValue, yValue]);
      }
    });

    return chartData;
  }

  getColumnType(value: any): string {
    if (typeof value === 'number') {
      return 'number';
    } else if (!isNaN(Date.parse(value))) {
      return 'date';
    } else {
      return 'string';
    }
  }

  parseValue(value: any, type: string): any {
    if (type === 'number') {
      return Number(value);
    } else if (type === 'date') {
      return new Date(value);
    } else {
      return value;
    }
  }

  onChartTypeChange(chartType: string): void {
    this.selectedChartType = chartType;
    this.createChart();
  }

  onXAxisChange(event: any): void {
    this.selectedXAxis = event.target.value;
    this.createChart();
  }

  onYAxisChange(event: any): void {
    this.selectedYAxis = event.target.value;
    this.createChart();
  }
}
