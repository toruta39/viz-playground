import * as d3 from "d3";
import { fundData, goalData } from "../data";
import useD3 from "./useD3";

export default function LineChart() {
  const ref = useD3(() => {
    // viewport
    let margin = {
        top: 30,
        right: 30,
        left: 100,
        bottom: 30
      },
      width = 500 - margin.left - margin.right,
      height = 200 - margin.top - margin.bottom;

    let svg = d3
      .select(ref.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .select(".container")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // axes
    let x = d3.scaleTime().range([0, width]);

    let y = d3.scaleLinear().range([height, 0]);

    const xAxis = (g) =>
      g
        .call(d3.axisBottom(x))
        .attr("transform", `translate(0, ${height})`)
        .selectAll("text")
        .attr("x", 0)
        .attr("dx", 8) // offset the text down a bit away from the axis
        .attr("y", 0)
        .attr("dy", ".35em") // middle the text to the tick on x-axis
        .attr("transform", "rotate(90)")
        .attr("text-anchor", "start");

    const yAxis = (g) => g.call(d3.axisLeft(y));

    // render with data
    x.domain(
      d3.extent(fundData, (d) => new Date(`${d.x}T00:00:00`)) as [Date, Date]
    );
    y.domain(d3.extent(fundData, (d) => d.y) as [number, number]);

    svg.select(".x-axis").call(xAxis);
    svg.select(".y-axis").call(yAxis);

    svg
      .select(".plot-area")
      .selectAll(".plot")
      .data([fundData, goalData])
      .join("path")
      .attr("class", "plot")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("fill", "none")
      .attr(
        "d",
        d3
          .line()
          .x((d) => x(new Date(`${d.x}T00:00:00`)))
          .y((d) => y(d.y))
      );
  }, [fundData, goalData]);

  return (
    <svg ref={ref}>
      <g className="container">
        <g className="plot-area" />
        <g className="x-axis" />
        <g className="y-axis" />
      </g>
    </svg>
  );
}
