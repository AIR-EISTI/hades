import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import * as d3 from 'd3';

import { WebSocketService } from '../services/websocket.service';
import { Stat } from '../models/game';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {

  @ViewChild('graph') private graphEl: ElementRef;
  @Input() private width = 600;
  @Input() private height = 400;
  @Input() private maxY = 100;
  @Input() private historyLength = 60;
  @Input() private prop = 'cpu';
  @Input() private color = '#2da0ce';

  private yScale: d3.ScaleContinuousNumeric<number, number>;
  private xScale: d3.ScaleContinuousNumeric<number, number>;

  private lineGen: d3.Line<Stat>;
  private areaGen: d3.Area<Stat>;
  private pathLine: d3.Selection<d3.BaseType, {}, null, undefined>;
  private pathArea: d3.Selection<d3.BaseType, {}, null, undefined>;

  private data: Stat[] = [];

  constructor(private webSocketService: WebSocketService) { }

  ngOnInit() {
    this.yScale = d3.scaleLinear()
      .domain([this.maxY, 0])
      .rangeRound([0, this.height]);

    this.xScale = d3.scaleLinear()
      .domain([this.historyLength, 0])
      .rangeRound([0, this.width]);

    this.lineGen = d3.line<Stat>()
      .y((d) => {
        return this.yScale(d[this.prop]);
      }).x((_, i) => {
        return this.xScale(i);
      }).curve(d3.curveNatural);

    this.areaGen = d3.area<Stat>()
      .y0(this.yScale(0))
      .y1((d) => {
        return this.yScale(d[this.prop]);
      }).x((_, i) => {
        return this.xScale(i);
      }).curve(d3.curveNatural);

    let svg = d3.select(this.graphEl.nativeElement)
      .attr('width', this.width)
      .attr('height', this.height);

    this.pathLine = svg.append('path')
      .attr('stroke', this.color)
      .attr('stroke-width', 3)
      .attr('fill', 'none');

    this.pathArea = svg.append('path')
      .attr('fill', this.color + '50');

    this.webSocketService.getEventFeed('game-stats').subscribe(msg => {
      this.addData(msg.data);
      this.updateData();
    });
  }

  updateData() {
    this.pathLine
      .data([this.data])
      .attr('d', this.lineGen);
    this.pathArea
      .data([this.data])
      .attr('d', this.areaGen);
  }

  addData(datum) {
    this.data.unshift(datum);
    this.data.splice(this.historyLength + 1, 1);
  }
}
