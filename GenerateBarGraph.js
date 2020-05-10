const D3Node = require('d3-node');
const d3 = require('d3');
const sharp = require('sharp');

const generateBarGraph = async (tempData) => {
    const options = {
        d3Module: d3,
        selector: '#chart',
        container: '<div id="container"><div id="chart"></div></div>'
    };
    const d3n = new D3Node(options);

    const margin = {
        top: 10, right: 5, bottom: 30, left: 5
    };
    const width = 1000 - margin.left - margin.right;
    const height = 450 - margin.top - margin.bottom;

    const xScale = d3.scaleBand().range([0, width]).padding(0.4);
    const yScale = d3.scaleLinear().range([height, 0]);
    // const g = svg.append('g').attr('transform', `translate(${ 100 },${ 100 })`);

    // const tempData = [{ year: 2020, value: 100 }, { year: 2019, value: 200 }, { year: 2018, value: 30 }, { year: 2017, value: 50 }, { year: 2016, value: 80 }];

    let yMax = d3.max(tempData, (d) => { return d.count; });
    yMax += yMax * 0.3;
    xScale.domain(tempData.map((d) => { return d.week; }));
    yScale.domain([0, yMax]);

    const svgWidth = width + margin.left + margin.right;
    const svgHeight = height + margin.top + margin.bottom;

    const svg = d3n.createSVG(svgWidth, svgHeight);

    // To fill background of the svg with white color. 
    svg.append('rect')
        .attr('width', '100%')
        .attr('height', '100%')
        .style('fill', 'white');

    svg.append('text')
        .attr('transform', 'translate(150,0)')
        .attr('x', 200)
        .attr('y', 50)
        .attr('font-size', '24px')
        .text('Features Deployed');

    svg.append('g').attr('transform', `translate(${ 100 },${ 100 })`);

    // svg.append('g')
    //   .attr('transform', `translate(${ margin.left },${ margin.top })`);

    svg.append('g')
        .attr('transform', `translate(50,${ height })`)
        .call(d3.axisBottom(xScale).tickFormat((d) => {
            return `Week ${ d }`;
        }))
        .append('text')
        .attr('y', height - 380)
        .attr('x', width - 500)
        .attr('text-anchor', 'end')
        .attr('stroke', 'black')
        .attr('font-size', '20px')
        .text('Week');

    svg.append('g')
        .attr('transform', 'translate(50,0)')
        .call(d3.axisLeft(yScale).ticks(5))
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 150)
        .attr('x', -150)
        .attr('dy', '-9.1em')
        .attr('text-anchor', 'end')
        .attr('stroke', 'black')
        .attr('font-size', '20px')
        .text('Count');

    svg.selectAll('.bar')
        .data(tempData)
        .enter().append('rect')
        .attr('transform', 'translate(50,0)')
        .attr('class', 'bar')
        .attr('x', (d) => { return xScale(d.week); })
        .attr('y', (d) => { return yScale(d.count); })
        .attr('width', xScale.bandwidth())
        .attr('height', (d) => { return height - yScale(d.count); })
        .style('fill', 'orange');

    // fs.writeFileSync('out.svg', d3n.svgString());

    const roundedCorners = await Buffer.from(
        d3n.svgString()
    );

    const pathToFile = './server/utils/';
    const fileName = `barGraph_${ new Date().getTime() }.png`;

    sharp(roundedCorners)
        // .resize(500, 225)
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


    // sharp('out.svg')
    //     .png()
    //     .toFile('sharp.png')
    //     .then((info) => {
    //         console.log('Svg to Png conversion completed', info);
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });
};

module.exports = {
    generateBarGraph: generateBarGraph
};
