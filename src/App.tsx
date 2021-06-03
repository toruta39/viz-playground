import "./styles.css";
import VisxLineChart from "./visx/LineChart";
import D3LineChart from "./d3/LineChart";

export default function App() {
  return (
    <div className="App">
      <VisxLineChart />
      <D3LineChart />
    </div>
  );
}
