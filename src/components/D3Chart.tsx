import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import {
  Box,
  Typography,
  useTheme,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";

interface D3ChartProps {
  data: Array<{ [key: string]: any }>;
  xKey: string;
  yKey: string;
  title?: string;
  type?: "bar" | "line" | "area";
  color?: string;
}

const D3Chart = ({
  data,
  xKey,
  yKey,
  title,
  type = "bar",
  color,
}: D3ChartProps) => {
  const theme = useTheme();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [chartType, setChartType] = useState<"bar" | "line" | "area">(type);
  const [hoveredData, setHoveredData] = useState<{
    value: number;
    name: string;
  } | null>(null);

  const handleChartTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newChartType: "bar" | "line" | "area" | null
  ) => {
    if (newChartType !== null) {
      setChartType(newChartType);
    }
  };

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const chartColor = color || theme.palette.primary.main;
    const secondaryColor = theme.palette.secondary.main;

    // Clear the SVG
    d3.select(svgRef.current).selectAll("*").remove();

    // Setup dimensions
    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = svgRef.current.clientHeight - margin.top - margin.bottom;

    // Create the SVG group
    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d[xKey]))
      .range([0, width])
      .padding(0.3);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d[yKey]) * 1.1 || 0])
      .range([height, 0]);

    // Create grid lines
    svg
      .append("g")
      .attr("class", "grid")
      .selectAll("line")
      .data(yScale.ticks(5))
      .enter()
      .append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", (d) => yScale(d))
      .attr("y2", (d) => yScale(d))
      .attr("stroke", "rgba(0, 0, 0, 0.05)")
      .attr("stroke-dasharray", "3,3");

    // Add X axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("transform", "translate(-10,5)rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", "12px")
      .style("fill", theme.palette.text.secondary);

    // Add Y axis
    svg
      .append("g")
      .call(
        d3
          .axisLeft(yScale)
          .ticks(5)
          .tickFormat((d) => {
            if (d >= 1000) {
              return d3.format(",.0f")(Number(d) / 1000) + "k";
            }
            return d3.format(",.0f")(d);
          })
      )
      .selectAll("text")
      .style("font-size", "12px")
      .style("fill", theme.palette.text.secondary);

    // Render the chart based on the selected type
    if (chartType === "bar") {
      // Create gradient for bars
      const gradient = svg
        .append("defs")
        .append("linearGradient")
        .attr("id", "bar-gradient")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0)
        .attr("y1", height)
        .attr("x2", 0)
        .attr("y2", 0);

      gradient
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", chartColor)
        .attr("stop-opacity", 0.7);

      gradient
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", chartColor)
        .attr("stop-opacity", 1);

      // Add bars
      svg
        .selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d) => xScale(d[xKey]) || 0)
        .attr("y", (d) => yScale(d[yKey]))
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => height - yScale(d[yKey]))
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("fill", "url(#bar-gradient)")
        .attr("cursor", "pointer")
        .on("mouseover", function (event, d) {
          d3.select(this)
            .transition()
            .duration(150)
            .attr("fill", secondaryColor);

          setHoveredData({ value: d[yKey], name: d[xKey] });
        })
        .on("mouseout", function () {
          d3.select(this)
            .transition()
            .duration(150)
            .attr("fill", "url(#bar-gradient)");

          setHoveredData(null);
        });
    } else if (chartType === "line" || chartType === "area") {
      // Create line generator
      const line = d3
        .line<any>()
        .x((d) => (xScale(d[xKey]) || 0) + xScale.bandwidth() / 2)
        .y((d) => yScale(d[yKey]))
        .curve(d3.curveMonotoneX);

      if (chartType === "area") {
        // Create area generator
        const area = d3
          .area<any>()
          .x((d) => (xScale(d[xKey]) || 0) + xScale.bandwidth() / 2)
          .y0(height)
          .y1((d) => yScale(d[yKey]))
          .curve(d3.curveMonotoneX);

        // Add gradient for area
        const areaGradient = svg
          .append("defs")
          .append("linearGradient")
          .attr("id", "area-gradient")
          .attr("gradientUnits", "userSpaceOnUse")
          .attr("x1", 0)
          .attr("y1", height)
          .attr("x2", 0)
          .attr("y2", 0);

        areaGradient
          .append("stop")
          .attr("offset", "0%")
          .attr("stop-color", chartColor)
          .attr("stop-opacity", 0.1);

        areaGradient
          .append("stop")
          .attr("offset", "100%")
          .attr("stop-color", chartColor)
          .attr("stop-opacity", 0.5);

        // Add area
        svg
          .append("path")
          .datum(data)
          .attr("class", "area")
          .attr("d", area)
          .attr("fill", "url(#area-gradient)");
      }

      // Add line
      svg
        .append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", chartColor)
        .attr("stroke-width", 3);

      // Add data points
      const circles = svg
        .selectAll(".data-point")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "data-point")
        .attr("cx", (d) => (xScale(d[xKey]) || 0) + xScale.bandwidth() / 2)
        .attr("cy", (d) => yScale(d[yKey]))
        .attr("r", 5)
        .attr("fill", "white")
        .attr("stroke", chartColor)
        .attr("stroke-width", 2)
        .attr("cursor", "pointer")
        .on("mouseover", function (event, d) {
          d3.select(this)
            .transition()
            .duration(150)
            .attr("r", 7)
            .attr("fill", secondaryColor);

          setHoveredData({ value: d[yKey], name: d[xKey] });
        })
        .on("mouseout", function () {
          d3.select(this)
            .transition()
            .duration(150)
            .attr("r", 5)
            .attr("fill", "white");

          setHoveredData(null);
        });
    }
  }, [data, xKey, yKey, svgRef, theme, chartType, color]);

  return (
    <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        {hoveredData ? (
          <Box>
            <Typography
              variant="h4"
              component="div"
              sx={{ fontWeight: 700, color: "primary.main" }}
            >
              {hoveredData.value.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {hoveredData.name}
            </Typography>
          </Box>
        ) : (
          title && (
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          )
        )}

        <ToggleButtonGroup
          value={chartType}
          exclusive
          onChange={handleChartTypeChange}
          aria-label="chart type"
          size="small"
          sx={{
            "& .MuiToggleButton-root": {
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              fontSize: "0.75rem",
              "&.Mui-selected": {
                backgroundColor: "primary.main",
                color: "white",
                "&:hover": {
                  backgroundColor: "primary.dark",
                  color: "white",
                },
              },
            },
          }}
        >
          <ToggleButton value="bar" aria-label="bar chart">
            Barras
          </ToggleButton>
          <ToggleButton value="line" aria-label="line chart">
            Linha
          </ToggleButton>
          <ToggleButton value="area" aria-label="area chart">
            Área
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ width: "100%", height: "calc(100% - 40px)" }}>
        <svg ref={svgRef} width="100%" height="100%" />
      </Box>
    </Box>
  );
};

export default D3Chart;
