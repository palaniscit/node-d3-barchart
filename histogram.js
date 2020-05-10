const D3Node = require('d3-node');
const d3 = require('d3');

// const styles = `
// .bar rect {
//   fill: steelblue;
// }

// .bar text {
//   fill: #fff;
//   font: 10px sans-serif;
// }`;

const options = {
  d3Module: d3,
  selector: '#chart',
  container: '<div id="container"><div id="chart"></div></div>'
};

const d3n = new D3Node(options);

// from https://bl.ocks.org/mbostock/3048450
// const data = d3.range(1000).map(d3.randomBates(10));

// const formatCount = d3.format(',.0f');

const margin = {
 top: 10, right: 5, bottom: 30, left: 5 
};
const width = 1000 - margin.left - margin.right;
const height = 450 - margin.top - margin.bottom;

// const x = d3.scaleLinear()
//   .rangeRound([0, width]);


const xScale = d3.scaleBand().range([0, width]).padding(0.4);
const yScale = d3.scaleLinear().range([height, 0]);
// const g = svg.append('g').attr('transform', `translate(${ 100 },${ 100 })`);

const tempData = [{ year: 2020, value: 100 }, { year: 2019, value: 200 }, { year: 2018, value: 30 }, { year: 2017, value: 50 }, { year: 2016, value: 80 }];

let yMax = d3.max(tempData, (d) => { return d.value; });
yMax += yMax * 0.3;
xScale.domain(tempData.map((d) => { return d.year; }));
yScale.domain([0, yMax]);

const svgWidth = width + margin.left + margin.right;
const svgHeight = height + margin.top + margin.bottom;

const svg = d3n.createSVG(svgWidth, svgHeight);
  
// svg.style('background-color', 'green');

svg.append('rect')
    .attr('width', '100%')
    .attr('height', '100%')
    .style('fill', 'white');

svg.append('text')
  .attr('transform', 'translate(150,0)')
  .attr('x', 50)
  .attr('y', 50)
  .attr('font-size', '24px')
  .text('XYZ Foods Stock Price');

svg.append('g').attr('transform', `translate(${ 100 },${ 100 })`);

// svg.append('g')
//   .attr('transform', `translate(${ margin.left },${ margin.top })`);

  svg.append('g')
  .attr('transform', `translate(50,${ height })`)
  .call(d3.axisBottom(xScale))
  .append('text')
  .attr('y', height - 380)
  .attr('x', width - 500)
  .attr('text-anchor', 'end')
  .attr('stroke', 'black')
  .attr('font-size', '20px')
  .text('Year');

svg.append('g')
  .attr('transform', 'translate(50,0)')
  .call(d3.axisLeft(yScale).tickFormat((d) => {
    return `$${ d }`;
  })
    .ticks(5))
  .append('text')
  .attr('transform', 'rotate(-90)')
  .attr('y', 150)
  .attr('x', -150)
  .attr('dy', '-9.1em')
  .attr('text-anchor', 'end')
  .attr('stroke', 'black')
  .attr('font-size', '20px')
  .text('Stock Price');

  svg.selectAll('.bar')
         .data(tempData)
         .enter().append('rect')
         .attr('transform', 'translate(50,0)')
         .attr('class', 'bar')
         .attr('x', (d) => { return xScale(d.year); })
         .attr('y', (d) => { return yScale(d.value); })
         .attr('width', xScale.bandwidth())
         .attr('height', (d) => { return height - yScale(d.value); })
         .style('fill', 'orange');


//   const x = d3.scaleLinear().range([0, width]);

// const bins = d3.histogram()
//   .domain(x.domain())
//   .thresholds(x.ticks(20))(data);

// const y = d3.scaleLinear()
//   .domain([0, d3.max(bins, (d) => { return d.length; })])
//   .range([height, 0]);

// const y = d3.scaleLinear()
//   .domain([0, d3.max(data, (d) => { return d.length; })])
//   .range([height, 0]);

// const svgWidth = width + margin.left + margin.right;
// const svgHeight = height + margin.top + margin.bottom;

// const svg = d3n.createSVG(svgWidth, svgHeight)
//   .append('g')
//   .attr('transform', `translate(${ margin.left },${ margin.top })`);

// const bar = svg.selectAll('.bar')
//   .data(bins)
//   .enter().append('g')
//   .attr('class', 'bar')
//   .attr('transform', (d) => { return `translate(${ x(d.x0) },${ y(d.length) })`; });

// bar.append('rect')
//   .attr('x', 1)
//   .attr('width', x(bins[0].x1) - x(bins[0].x0) - 1)
//   .attr('height', (d) => { return height - y(d.length); })
//   .style('fill', 'orange')
//   .style('margin-right', '10px');

// bar.append('text')
//   .attr('dy', '.75em')
//   .attr('y', 6)
//   .attr('x', (x(bins[0].x1) - x(bins[0].x0)) / 2)
//   .attr('text-anchor', 'middle')
//   .text((d) => { return formatCount(d.length); });

// svg.append('g')
//   .attr('class', 'axis axis--x')
//   .attr('transform', `translate(0,${ height })`)
//   .call(d3.axisBottom(x));

 const fs = require('fs');
 fs.writeFileSync('out.svg', d3n.svgString());

const sharp = require('sharp');

// const roundedCorners = Buffer.from(
//     d3n.svgString()
//   );

// sharp(roundedCorners)
//   .resize(200, 200)
//   .toFile('output1.png', (err, info) => { 
//       console.log(err);
//       console.log(info);
//    });


   sharp('out.svg')
    .png()
    .toFile('sharp.png')
    .then((info) => {
        console.log('Svg to Png conversion completed', info);
    })
    .catch((err) => {
        console.log(err);
    });
