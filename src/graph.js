const nodes = [
  { id: "A", metadata: "Start Node" },
  { id: "B", metadata: "Intermediate Node" },
  { id: "C", metadata: "End Node" },
];

const links = [
  { source: "A", target: "B" },
  { source: "B", target: "C" },
];
// setup the canvas
const width = 800;
const height = 600;
const svg = d3
  .select("#graph")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Create simulation
const simulation = d3
  .forceSimulation(nodes)
  .force(
    "link",
    d3.forceLink(links)
      .id(d => d.id)
      .distance(150)
  )
  .force("charge", d3.forceManyBody().strength(-300))
  .force("center", d3.forceCenter(width / 2, height / 2));

// Draw links
const link = svg
  .selectAll(".link")
  .data(links)
  .enter()
  .append("line")
  .attr("class", "link")
  .style("stroke", "#aaa");

// Draw nodes
const node = svg
  .selectAll(".node")
  .data(nodes)
  .enter()
  .append("circle")
  .attr("class", "node")
  .attr("r", 20)
  .style("fill", "#69b3a2")
  .call(
    d3
      .drag()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      })
  );

// Add labels
const label = svg
  .selectAll(".label")
  .data(nodes)
  .enter()
  .append("text")
  .attr("class", "label")
  .attr("dy", -25)
  .attr("text-anchor", "middle")
  .text(d => d.id);

// Add metadata on hover
node.append("title").text(d => d.metadata);

// New interactive functionality: create info panel and update on node click
const infoPanel = d3.select("body")
  .append("div")
  .attr("id", "info")
  .style("position", "absolute")
  .style("top", "10px")
  .style("right", "10px")
  .style("background", "#f9f9f9")
  .style("padding", "10px")
  .style("border", "1px solid #ccc");

node.on("click", (event, d) => {
  infoPanel.html(`<h3>Node Info</h3><p>ID: ${d.id}</p><p>Description: ${d.metadata}</p>`);
});

// Update simulation
simulation.on("tick", () => {
  link
    .attr("x1", d => d.source.x || 0)
    .attr("y1", d => d.source.y || 0)
    .attr("x2", d => d.target.x || 0)
    .attr("y2", d => d.target.y || 0);

  node
    .attr("cx", d => d.x || 0)
    .attr("cy", d => d.y || 0);

  label
    .attr("x", d => d.x || 0)
    .attr("y", d => d.y || 0);
});
