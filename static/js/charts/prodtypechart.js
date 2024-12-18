const drawProdTypeChart = (data, rawData) => {
  const width = 300;
  const height = 200;
  const radius = 200/2;
  
  const MTDTotal = data.reduce((total, d) => total + d.value, 0)
  dates = new Set(rawData.map(d => d.date))

  const arc = d3.arc()
    .startAngle(d => d.startAngle)
    .endAngle(d => d.endAngle)
    .innerRadius(radius * 0.6)
    .outerRadius(radius - 1)
    .padAngle(0.02)
    .cornerRadius(3);

  const pie = d3.pie()
    .padAngle(1/radius)
    .sort(null)
    .value(d => d.value);

  const color = d3.scaleOrdinal()
    .domain(data.map(d => d.name))
    .range(d3.schemeTableau10)
    // .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse());

  const svg = d3.create("svg")
    .attr("viewBox", [-width/2, -height/2, width, height])

  svg.append("g")
    .selectAll()
    .data(pie(data))
    .join("path")
      .attr("fill", d => color(d.data.name))
      .attr("opacity", 0.8)
      .attr("d", arc)
    .append("title")
      .text(d => `${d.data.name} - ${d.data.value}`);
  
  svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 8)
      .attr("text-anchor", "middle")
    .selectAll()
    .data(pie(data))
    .join("text")
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25)
        .append("tspan")
          .text(d => d.data.name)
          .attr("y", "-0.5em")
          .style("text-transform", "uppercase")
          .attr("fill", "#f6fafc")
          .attr("font-weight", 500))
      .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25)
        .append("tspan")
          .attr("x", 0)
          .attr("y", "0.8em")
          .attr("fill-opacity", 1)
          .attr("fill", "#f6fafc")
          .text(d => d3.format(".3s")(d.data.value))
        .append("tspan")
          .attr("x", 0)
          .attr("y", "2em")
          .attr("fill-opacity", 1)
          .attr("fill", "#f6fafc")
          .text(d => `${d3.format(".3s")(d.data.value/MTDTotal*100)}%`))

  svg.append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
    .append("tspan")
      .text(d3.format("$,.0f")(MTDTotal))
      .attr("y", "0.2em")
      .attr("font-size", "20px")
      .attr("font-weight", 500)
    .append("tspan")
      .text("Value Total")
      .attr("x", "-0.25em")
      .attr("y", "-1.5em")
      .attr("font-size", "14px")
    .append("tspan")
      .text(`from ${rawData[rawData.length-1].date}`)
      .attr("x", "-1.5em")
      .attr("y", "2.5em")
      .attr("font-size", "10px")
      .attr("opacity", 0.5)
    .append("tspan")
      .text(`to ${rawData[0].date}`)
      .attr("x", "1em")
      .attr("y", "4em")
      .attr("font-size", "10px")

  svg.append("text")
      .text(`Working days: ${dates.size}`)
      .attr("text-anchor", "start")
      .attr("dominant-baseline", "middle")
      .attr("x", -width/2)
      .attr("y", -height/2 + 5)
      .attr("fill", "#75485E")
      .attr("font-size", "10px")
  
  svg.append("text")
      .text(`Avg: ${d3.format("$,.0f")(MTDTotal/dates.size)}`)
      .attr("text-anchor", "start")
      .attr("dominant-baseline", "middle")
      .attr("x", -width/2)
      .attr("y", -height/2 + 20)
      .attr("fill", "#75485E")
      .attr("font-size", "10px")

  // const totalDays = Math.abs(new Date(rawData[rawData.length-1].date).getDate() - new Date(rawData[0].date).getDate())
  // svg.append("text")
  //     .text(`Total days: ${totalDays}`)
  //     .attr("text-anchor", "start")
  //     .attr("dominant-baseline", "middle")
  //     .attr("x", -width/2)
  //     .attr("y", height/2 - 20)
  //     .attr("fill", "#75485E")
  //     .attr("font-size", "10px")

  // svg.append("text")
  //     .text(`Avg: ${d3.format("$,.0f")(MTDTotal/totalDays)}`)
  //     .attr("text-anchor", "start")
  //     .attr("dominant-baseline", "middle")
  //     .attr("x", -width/2)
  //     .attr("y", height/2 - 5)
  //     .attr("fill", "#75485E")
  //     .attr("font-size", "10px")

  svg.append("text")
      .text("Latest update at")
      .attr("text-anchor", "end")
      .attr("dominant-baseline", "middle")
      .attr("x", width/2 - 10)
      .attr("y", -height/2 + 5)
      .attr("fill", "#75485E")
      .attr("font-size", "10px")

  const latestDate = rawData[0].createdat.slice(0, 10)
  const latestTime = rawData[0].createdat.slice(11, 16)
  svg.append("text")
      .text(latestDate)
      .attr("text-anchor", "end")
      .attr("dominant-baseline", "middle")
      .attr("x", width/2 - 10)
      .attr("y", -height/2 + 20)
      .attr("fill", "#75485E")
      .attr("font-size", "10px")

  svg.append("text")
      .text(latestTime)
      .attr("text-anchor", "end")
      .attr("dominant-baseline", "middle")
      .attr("x", width/2 - 10)
      .attr("y", -height/2 + 35)
      .attr("fill", "#75485E")
      .attr("font-size", "10px")
    
  return svg.node();
}