import { Component,
         OnInit,
         AfterContentInit,
         ElementRef,
         ViewChild,
         Input,
         HostListener
} from '@angular/core';
import { Subscription } from 'rxjs';
import * as d3 from 'd3';

import { WebSocketService } from '../services/websocket.service';
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
  @Input() private prop = 'cpu';
  @Input() private color = '#2da0ce';
  @Input() private title = 'CPU';
  @Input() private displayFunction = (current, max) => {return (current*100/max).toFixed(2) + '%'};

  private sub: Subscription;

  private yScale: d3.ScaleContinuousNumeric<number, number>;
  private xScale: d3.ScaleContinuousNumeric<number, number>;

  private lineGen: d3.Line<Stat>;
  private areaGen: d3.Area<Stat>;
  private pathLine: d3.Selection<d3.BaseType, {}, null, undefined>;
  private pathArea: d3.Selection<d3.BaseType, {}, null, undefined>;

  private data: Stat[] = [];

  constructor(private webSocketService: WebSocketService) { }

  ngOnInit() {
    let svg = d3.select(this.graphEl.nativeElement)
      .attr('height', this.height);

    this.yScale = d3.scaleLinear()
      .domain([this.maxY, 0])
      .rangeRound([0, this.height]);

    this.lineGen = d3.line<Stat>()
      .y((d) => {
        return this.yScale(d[this.prop]);
      }).x((_, i) => {
        return this.xScale(i);
      }).curve(d3.curveMonotoneX);

    this.areaGen = d3.area<Stat>()
      .y0(this.height)
      .y1((d) => {
        return this.yScale(d[this.prop]);
      }).x((_, i) => {
        return this.xScale(i);
      }).curve(d3.curveMonotoneX);

    this.pathLine = svg.append('path')
      .attr('stroke', this.color)
      .attr('stroke-width', 3)
      .attr('fill', 'none');

    this.pathArea = svg.append('path')
      .attr('fill', this.color + '50');

    this.sub = this.webSocketService.getEventFeed('game-stats').subscribe(msg => {
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

  ngOnDestroy() {
    console.log('unsubscribed')
    this.sub.unsubscribe();
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

  addData(datum) {
    this.data.unshift(datum);
    this.data.splice(this.historyLength + 1, 1);
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.createXScale();
    this.updateData();
  }

  public setData(data) {
    setTimeout(() => {
      this.data = data.reverse().slice(0, 60);
      this.updateData();
    }, 0);
  }
}
