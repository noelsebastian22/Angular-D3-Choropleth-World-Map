import { Component } from '@angular/core';
import * as d3 from 'd3v4';
import * as firstModel from '../assets/first20_med_a2.json';
import * as secondModel from '../assets/second20_med_a2.json';
import * as thirdModel from '../assets/third20_med_a2.json';
import * as fourthModel from '../assets/fourth20_med_a2.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  firstModelData = firstModel['default'];
  secondModelData = secondModel['default'];
  thirdModelData = thirdModel['default'];
  fourthModelData = fourthModel['default'];
  jsons;
  title = 'd3-animated-map';

  ngOnInit() {
    this.jsons = [
      this.firstModelData,
      this.secondModelData,
      this.thirdModelData,
      this.fourthModelData,
    ];
    this.setMap(1000, 600, this.firstModelData);

    let time = 1;

    let interval = setInterval(() => {
      if (time <= 3) {
        this.transitionMap(this.jsons, time);
        time++;
      } else {
        clearInterval(interval);
      }
    }, 2000);
  }

  setMap(width, height, dataset) {
    const margin = { top: 10, right: 30, bottom: 10, left: 30 };
    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom;

    const color_domain = [2.5, 4, 7, 9, 10];

    const color_legend = d3
      .scaleThreshold<string>()
      .range(['#fee5d9', '#fcbba1', '#fc9272', '#fb6a4a', '#de2d26', '#a50f15'])
      .domain(color_domain);

    const projection = d3
      .geoMercator()
      .rotate([-11, 0])
      .scale(1)
      .translate([0, 0]);

    const path = d3.geoPath().projection(projection);

    const svg = d3
      .select('.world-map')
      .append('svg')
      .attr('viewBox', '0 0 1000 600')
      .attr('preserveAspectRatio', 'xMidYMid')
      .style('max-width', 1200)
      .style('margin', 'auto')
      .style('display', 'flex');

    const b = path.bounds(dataset),
      s =
        0.95 /
        Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
      t = [
        (width - s * (b[1][0] + b[0][0])) / 2,
        (height - s * (b[1][1] + b[0][1])) / 2,
      ];
    projection.scale(s).translate(t);

    svg
      .selectAll('path')
      .data(dataset.features)
      .enter()
      .append('path')
      .attr('d', path)
      .style('fill', function (d) {
        const value = d['Change_f'];
        if (value) {
          return color_legend(d['Change_f']);
        } else {
          return '#ccc';
        }
      })
      .style('stroke', '#fff')
      .style('stroke-width', '0.5');
  }

  transitionMap(json, i) {
    const svg = d3.select('.world-map');

    const color_domain = [2.5, 4, 7, 9, 10];

    const color_legend = d3
      .scaleThreshold<string>()
      .range(['#fee5d9', '#fcbba1', '#fc9272', '#fb6a4a', '#de2d26', '#a50f15'])
      .domain(color_domain);

    svg
      .selectAll('path')
      .data(json[i].features)
      .transition()
      .delay(100)
      .duration(1000)
      .style('fill', function (d) {
        const value = d['Change_f'];
        if (value) {
          return color_legend(d['Change_f']);
        } else {
          return '#ccc';
        }
      });
  }
}
