// src/components/MoodChart.js
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Filler,
  Legend
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Filler,
  Legend
);

const moodColors = {
  "very-bad": "#dc2626",
  bad: "#f97316",
  neutral: "#a3a3a3",
  good: "#22c55e",
  "very-good": "#2563eb",
};

function MoodChart({ entries }) {
  if (!entries || entries.length === 0) {
    return (
      <p className="text-gray-500 text-sm">
        No mood entries yet. Add some moods to see your chart!
      </p>
    );
  }

  const labels = entries.map(e =>
    new Date(e.date).toLocaleDateString()
  );

  const moodValues = entries.map(e => {
    switch (e.mood) {
      case "very-bad": return 1;
      case "bad": return 2;
      case "neutral": return 3;
      case "good": return 4;
      case "very-good": return 5;
      default: return 0;
    }
  });

  const chartColor = "#2563eb33";

  const data = {
    labels,
    datasets: [
      {
        label: "Mood Trend",
        data: moodValues,
        fill: true,
        backgroundColor: chartColor,
        borderColor: "#2563eb",
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: entries.map(e => moodColors[e.mood]),
      }
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        min: 1,
        max: 5,
        title: { display: true, text: "Mood Level" },
        ticks: {
          callback: (v) =>
            ["Very Bad", "Bad", "Neutral", "Good", "Very Good"][v - 1]
        }
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md border">
      <Line data={data} options={options} />
    </div>
  );
}

export default MoodChart;
