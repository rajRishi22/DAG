import * as d3 from "d3";
const nodes = [
    { id: "A", metadata: "Start Node" },
    { id: "B", metadata: "Intermediate Node" },
    { id: "C", metadata: "End Node" },
];
const links = [
    { source: "A", target: "B" },
    { source: "B", target: "C" },
];
// Set up SVG canvas
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
    .force("link", d3.forceLink(links)
    .id((d) => d.id) // changed code: cast to Node
    .distance(150))
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
    .call(d3
    .drag()
    .on("start", (event, d) => {
    if (!event.active)
        simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
})
    .on("drag", (event, d) => {
    d.fx = event.x;
    d.fy = event.y;
})
    .on("end", (event, d) => {
    if (!event.active)
        simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}));
// Add labels
const label = svg
    .selectAll(".label")
    .data(nodes)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("dy", -25)
    .attr("text-anchor", "middle")
    .text((d) => d.id);
// Add metadata on hover
node.append("title").text((d) => d.metadata);
// Update simulation
simulation.on("tick", () => {
    link
        .attr("x1", (d) => { var _a; return ((_a = d.source.x) !== null && _a !== void 0 ? _a : 0); })
        .attr("y1", (d) => { var _a; return ((_a = d.source.y) !== null && _a !== void 0 ? _a : 0); })
        .attr("x2", (d) => { var _a; return ((_a = d.target.x) !== null && _a !== void 0 ? _a : 0); })
        .attr("y2", (d) => { var _a; return ((_a = d.target.y) !== null && _a !== void 0 ? _a : 0); });
    node
        .attr("cx", (d) => { var _a; return ((_a = d.x) !== null && _a !== void 0 ? _a : 0); })
        .attr("cy", (d) => { var _a; return ((_a = d.y) !== null && _a !== void 0 ? _a : 0); });
    label
        .attr("x", (d) => { var _a; return ((_a = d.x) !== null && _a !== void 0 ? _a : 0); })
        .attr("y", (d) => { var _a; return ((_a = d.y) !== null && _a !== void 0 ? _a : 0); });
});
