import { Component,
         OnInit,
         AfterContentInit,
         ElementRef,
         ViewChild,
         Input
} from '@angular/core';
import * as d3 from 'd3';

import { Stat } from '../models/server';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit, AfterContentInit {

  @ViewChild('graph') private graphEl: ElementRef;
  @Input() private width = null;
  @Input() private height = 400;
  @Input() private maxY = 100;
  @Input() private historyLength = 60;
  @Input() private prop;
  @Input() private color = '#2da0ce';
  @Input() private label;
  @Input() private displayFunction = (current, max) => {return (current*100/max).toFixed(2) + '%'};

  private title: string = '';

  private yScale: d3.ScaleContinuousNumeric<number, number>;
  private xScale: d3.ScaleContinuousNumeric<number, number>;

  private lineGen: d3.Line<Stat>;
  private areaGen: d3.Area<Stat>;
  private pathLine: d3.Selection<d3.BaseType, {}, null, undefined>;
  private pathArea: d3.Selection<d3.BaseType, {}, null, undefined>;
  private svg: d3.Selection<d3.BaseType, {}, null, undefined>;

  constructor() { }

  ngOnInit() {
    this.svg = d3.select(this.graphEl.nativeElement)
      .attr('height', this.height);

    this.yScale = d3.scaleLinear()
      .domain([this.maxY, 0])
      .rangeRound([10, this.height-10]);

    this.lineGen = d3.line<Stat>()
      .y((d) => {
        return this.yScale(d[this.prop]);
      }).x((_, i) => {
        return this.xScale(i);
      }).curve(d3.curveMonotoneX);

    this.areaGen = d3.area<Stat>()
      .y0(this.height - 10)
      .y1((d) => {
        return this.yScale(d[this.prop]);
      }).x((_, i) => {
        return this.xScale(i);
      }).curve(d3.curveMonotoneX);

    this.pathLine = this.svg.append('path')
      .attr('stroke', this.color)
      .attr('stroke-width', 3)
      .attr('fill', 'none');

    this.pathArea = this.svg.append('path')
      .attr('fill', this.color + '50');

    this.svg.append('g')
      .call(d3.axisRight(this.yScale)
      .ticks(3, "s"));

  }

  updateData(data) {
    this.pathLine
      .data([data])
      .attr('d', this.lineGen);
    this.pathArea
      .data([data])
      .attr('d', this.areaGen);
    this.title = this.label
    if (data.length)
      this.title += ': ' + this.displayFunction(data[0][this.prop], this.maxY)
  }

  ngAfterContentInit() {
    this.createXScale();
  }

  createXScale() {
    this.width = this.graphEl.nativeElement.getBoundingClientRect().width
    this.xScale = d3.scaleLinear()
      .domain([this.historyLength, 0])
      .rangeRound([0, this.width]);
  }
}
