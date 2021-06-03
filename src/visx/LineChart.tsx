import styled from "styled-components";
import { format } from "date-fns";
import { Axis, Grid, LineSeries, Tooltip, XYChart } from "@visx/xychart";
import * as d3 from "d3";
import { fundData, goalData, years, Datum } from "../data";

const ChartContainer = styled.div`
  text {
    font-family: "Untitled Sans", sans-serif;
  }

  .visx-axis-tick {
    text {
      font-size: 12px;
      font-weight: 400;
      fill: #666666;
    }
  }
`;

const ColoredSquare = styled.div`
  display: inline-block;
  width: 11px;
  height: 11px;
  margin-right: 8px;
  background: ${({ color }) => color};
  border-radius: 4px;
`;

const TooltipContainer = styled.div`
  padding: 8px 16px;
  font-size: 12px;
  border-radius: 4px;
  color: #222222;

  .row {
    margin-bottom: 8px;
  }
  .row:last-child {
    margin-bottom: 0;
  }
  .date {
    font-size: 12px;
    margin-bottom: 8px;
    color: #222222;
    font-weight: 600;
  }
  .value {
    display: flex;
    align-items: center;
    font-weight: 400;
    color: #000000;
  }
`;

const accessors = {
  xAccessor: (d: Datum) => new Date(`${d.x}T00:00:00`),
  yAccessor: (d: Datum) => d.y
};

export default function LineChart() {
  return (
    <ChartContainer>
      <XYChart
        height={270}
        margin={{ left: 60, top: 35, bottom: 38, right: 27 }}
        xScale={{ type: "time" }}
        yScale={{ type: "linear" }}
      >
        <Grid
          columns={false}
          lineStyle={{
            stroke: "#e1e1e1",
            strokeLinecap: "round",
            strokeWidth: 1
          }}
          strokeDasharray="4"
        />
        <Axis orientation="bottom" tickLabelProps={() => ({ dy: 0 })} />
        <Axis
          orientation="left"
          tickLabelProps={() => ({ dx: -0 })}
          tickFormat={d3.format(".2s")}
        />
        <LineSeries
          stroke="steelblue"
          dataKey="fund"
          data={fundData}
          {...accessors}
        />
        <LineSeries
          stroke="orange"
          dataKey="goal"
          data={goalData}
          {...accessors}
        />
        <Tooltip<Datum>
          snapTooltipToDatumX
          snapTooltipToDatumY
          showSeriesGlyphs
          glyphStyle={{
            fill: "#008561",
            strokeWidth: 0
          }}
          renderTooltip={({ tooltipData }) => {
            return (
              tooltipData && (
                <TooltipContainer>
                  {Object.entries(tooltipData.datumByKey).map(
                    (lineDataArray, i) => {
                      const [key, value] = lineDataArray;

                      return (
                        <div className="row" key={key}>
                          {i === 0 && (
                            <div className="date">
                              {format(
                                accessors.xAccessor(value.datum),
                                "yyyy-MM-dd"
                              )}
                            </div>
                          )}
                          <div className="value">
                            <ColoredSquare color="#008561" />
                            {accessors.yAccessor(value.datum).toFixed(2)}
                          </div>
                        </div>
                      );
                    }
                  )}
                </TooltipContainer>
              )
            );
          }}
        />
      </XYChart>
    </ChartContainer>
  );
}
