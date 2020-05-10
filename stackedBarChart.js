const D3Node = require('d3-node');
const d3 = require('d3');

let models = [
  {
    model_name: 'f1',
    field1: 19,
    field2: 83
  },
  {
    model_name: 'f2',
    field2: 93
  },
  {
    model_name: 'f3',
    field1: 10,
    field2: 56
  },
  {
    model_name: 'f4',
    field1: 98
  }
];
models = models.map((i) => {
  i.model_name = i.model_name;
	return i;
});

console.log(models);

const options = {
    d3Module: d3,
    selector: '#stackedBar',
    container: '<div id="container"><div id="stackedBar"></div></div>'
  };

const d3n = new D3Node(options);

const width = 500;
const height = 300;
const margin = {
  top: 30, right: 20, bottom: 30, left: 50
};
const barPadding = 0.2;
const axisTicks = { qty: 5, outerSize: 0, dateFormat: '%m-%d' };

const xScale0 = d3.scaleBand().range([0, width - margin.left - margin.right]).padding(barPadding);
const xScale1 = d3.scaleBand();
const yScale = d3.scaleLinear().range([height - margin.top - margin.bottom, 0]);

const xAxis = d3.axisBottom(xScale0).tickSizeOuter(axisTicks.outerSize);
const yAxis = d3.axisLeft(yScale).ticks(axisTicks.qty).tickSizeOuter(axisTicks.outerSize);

let yMax = d3.max(models, d => (d.field1 > d.field2 ? d.field1 : d.field2));
yMax += yMax * 0.3;

console.log(Math.max(10, models[1].field3, 100, -12, -150, 99, 101)); 

xScale0.domain(models.map(d => d.model_name));
xScale1.domain(['field1', 'field2']).range([0, xScale0.bandwidth()]);
yScale.domain([0, yMax]);

const svg = d3n.createSVG(width, height);

svg.append('rect')
    .attr('width', '100%')
    .attr('height', '100%')
    .style('fill', 'white');

svg.append('text')
    .attr('transform', 'translate(40,0)')
    .attr('x', 70)
    .attr('y', 50)
    .attr('font-size', '18px')
    .text('Features Deployed by Product Team');

svg.append('g').attr('transform', `translate(${ margin.left },${ margin.top })`);

const modelName = svg.selectAll('.model_name')
  .data(models)
  .enter().append('g')
  .attr('class', 'model_name')
  .attr('transform', d => `translate(${ xScale0(d.model_name) },0)`);

/* Add field1 bars */
modelName.selectAll('.bar.field1')
  .data(d => [d])
  .enter()
  .append('rect')
  .attr('transform', 'translate(50,0)')
  .attr('class', 'bar field1')
  .style('fill', '#f4a582')
  .attr('x', d => xScale1('field1'))
  .attr('y', d => yScale(d.field1))
  .attr('width', xScale1.bandwidth())
  .attr('height', (d) => {
    return height - margin.top - margin.bottom - yScale(d.field1);
  });
  
/* Add field2 bars */
modelName.selectAll('.bar.field2')
  .data(d => [d])
  .enter()
  .append('rect')
  .attr('transform', 'translate(50,0)')
  .attr('class', 'bar field2')
  .style('fill', '#92c5de')
  .attr('x', d => xScale1('field2'))
  .attr('y', d => yScale(d.field2))
  .attr('width', xScale1.bandwidth())
  .attr('height', (d) => {
    return height - margin.top - margin.bottom - yScale(d.field2);
  });
 
// Add the X Axis
svg.append('g')
   .attr('class', 'x axis')
   .attr('transform', `translate(50,${ height - margin.top - margin.bottom })`)
   .call(xAxis);

// Add the Y Axis
svg.append('g')
   .attr('class', 'y axis')
   .attr('transform', 'translate(50,0)')
   .call(yAxis); 


      // Legend
//   const legend = svg.selectAll('.legend')
//   .data(data[0].values.map((d) => { return d.rate; }).reverse())
// .enter().append('g')
//   .attr('class', 'legend')
//   .attr('transform', (d, i) => { return `translate(0,${ i * 20 })`; })
//   .style('opacity', '0');

// legend.append('rect')
//   .attr('x', width - 18)
//   .attr('width', 18)
//   .attr('height', 18)
//   .style('fill', (d) => { return color(d); });

// legend.append('text')
//   .attr('x', width - 24)
//   .attr('y', 9)
//   .attr('dy', '.35em')
//   .style('text-anchor', 'end')
//   .text((d) => { return d; });

// legend.transition().duration(500).delay((d, i) => { return 1300 + 100 * i; }).style('opacity', '1');

const fs = require('fs');
 fs.writeFileSync('stackedbar.svg', d3n.svgString());

 const sharp = require('sharp');

sharp('stackedbar.svg')
    .png()
    .toFile('stackedbar.png')
    .then((info) => {
        console.log('Svg to Png conversion completed', info);
    })
    .catch((err) => {
        console.log(err);
    });
