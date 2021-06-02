import styled from "styled-components";
import { format, add } from "date-fns";
import { Axis, Grid, LineSeries, Tooltip, XYChart } from "@visx/xychart";

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

interface Datum {
  x: string;
  y: number;
}

const data: Datum[] = [];
const data2: Datum[] = [];

let startDate = new Date(2020, 0, 1);
let startFund = 100000;
let incrFund = 1000;
let annualYield = 10 / 100;
let years = 30;

let annualInflation = 2.5 / 100;
let goal = 1000000;

for (
  let i = 0, lastDate = startDate, lastFund = startFund;
  i < years * 12;
  i++
) {
  data.push({
    x: format(lastDate, "yyyy-MM-dd"),
    y: lastFund
  });

  data2.push({
    x: format(lastDate, "yyyy-MM-dd"),
    y: goal * Math.pow(1 + annualInflation, i / 12)
  });

  lastDate = add(lastDate, { months: 1 });
  lastFund = lastFund * (1 + annualYield / 12) + incrFund;
}

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
          numTicks={4} // how is this acting
          lineStyle={{
            stroke: "#e1e1e1",
            strokeLinecap: "round",
            strokeWidth: 1
          }}
          strokeDasharray="0, 4" // dashed line grid?
        />
        {/* is this the x axis?  */}
        <Axis
          hideAxisLine
          hideTicks
          orientation="bottom"
          tickLabelProps={() => ({ dy: 0 })}
          numTicks={years}
        />
        {/* is this the y axis?  */}
        <Axis
          hideAxisLine
          hideTicks
          orientation="left"
          numTicks={10}
          tickLabelProps={() => ({ dx: -0 })}
        />
        {/* this seems to be the plot */}
        <LineSeries
          stroke="#008561"
          dataKey="fund_accumulation"
          data={data}
          {...accessors}
        />
        <LineSeries
          stroke="#006185"
          dataKey="goal_with_inflation"
          data={data2}
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
