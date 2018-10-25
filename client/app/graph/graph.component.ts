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
  @Input() private data: Stat[] = [];

  private title: string = '';

  private yScale: d3.ScaleContinuousNumeric<number, number>;
  private xScale: d3.ScaleContinuousNumeric<number, number>;

  private lineGen: d3.Line<Stat>;
  private areaGen: d3.Area<Stat>;

  private svg: d3.Selection<d3.BaseType, {}, null, undefined>;
  private pathLine: d3.Selection<d3.BaseType, {}, null, undefined>;
  private pathArea: d3.Selection<d3.BaseType, {}, null, undefined>;
  private cursorInfo: d3.Selection<d3.BaseType, {}, null, undefined>;
  private cursorPoint: d3.Selection<d3.BaseType, {}, null, undefined>;


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

    this.svg
      .call(d3.axisRight(this.yScale)
      .ticks(3, "s"));

    this.cursorInfo = this.svg.append('line')
      .attr('y1', 0)
      .attr('y2', this.height)
      .attr('stroke', 'currentColor')
      .attr('stroke-width', 0.5)
      .style('opacity', 0);

    this.cursorPoint = this.svg.append('circle')
      .attr('r', 5)
      .attr('fill', this.color)
      .style('opacity', 0);
  }

  ngAfterContentInit() {
    this.createXScale();
  }

  updateData(data) {
    this.data = data;
    this.pathLine
      .data([this.data])
      .attr('d', this.lineGen);
    this.pathArea
      .data([this.data])
      .attr('d', this.areaGen);
    this.title = this.label;
    if (this.data.length)
      this.title += ': ' + this.displayFunction(this.data[0][this.prop], this.maxY);
  }

  createXScale() {
    this.width = this.graphEl.nativeElement.getBoundingClientRect().width
    this.xScale = d3.scaleLinear()
      .domain([this.historyLength, 0])
      .rangeRound([0, this.width]);
  }

  onMouseMove(event) {
    let x = event.layerX;
    this.cursorInfo.attr('x1', x).attr('x2', x);
    let index = this.xScale.invert(x);
    if (index >= this.data.length - 1) {
      return;
    }
    let previousData = this.data[Math.ceil(index)][this.prop];
    let nextData = this.data[Math.floor(index)][this.prop];
    let currentData = nextData + (previousData - nextData) * (index % 1);
    this.cursorPoint
      .attr('cx', x)
      .attr('cy', this.yScale(currentData));
  }

  onMouseLeave() {
    this.cursorInfo.style('opacity', 0);
    this.cursorPoint.style('opacity', 0);
  }

  onMouseEnter() {
    this.cursorInfo.style('opacity', 1);
    this.cursorPoint.style('opacity', 1);
  }
}
