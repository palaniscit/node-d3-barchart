const D3Node = require('d3-node');
const d3 = require('d3');
const sharp = require('sharp');

const generateStackedBar = async (data) => {
    const options = {
        d3Module: d3,
        selector: '#chart',
        container: '<div id="container"><div id="chart"></div></div>'
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
    
    let yMax = d3.max(data, d => (d.field1 > d.field2 ? d.field1 : d.field2));
    yMax += yMax * 0.3;
    
    xScale0.domain(data.map(d => d.model_name));
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
      .data(data)
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

       const roundedCorners = await Buffer.from(
        d3n.svgString()
    );

    const pathToFile = './server/utils/';
    const fileName = `stackedBar_${ new Date().getTime() }.png`;

    sharp(roundedCorners)
        .toFile(pathToFile + fileName, (err, info) => {
            if (err) {
                console.log('Svg to Png conversion failed: ', err);
                throw err;
            }
            if (info) {
                console.log('Svg to Png conversion completed: ', info);
            }
        });
    
    return [pathToFile, fileName];
};

module.exports = {
    generateStackedBar: generateStackedBar
};
