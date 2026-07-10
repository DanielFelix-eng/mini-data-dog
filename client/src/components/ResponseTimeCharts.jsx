import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const ResponseTimeChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-5 h-96 flex items-center justify-center">
        <h2 className="text-lg font-semibold mb-4 absolute top-5 left-5">
          Response Time
        </h2>
        <p className="text-slate-400 text-sm">No data yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-5 h-96">
      <h2 className="text-lg font-semibold mb-4">Response Time</h2>

      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="createdAt"
            tickFormatter={(value) =>
              new Date(value).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            }
          />

          <YAxis
            label={{
              value: "ms",
              angle: -90,
              position: "insideLeft",
            }}
          />

          <Tooltip
            labelFormatter={(value) => new Date(value).toLocaleString()}
          />

          <Line
            type="monotone"
            dataKey="responseTime"
            stroke="#3B82F6"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResponseTimeChart;