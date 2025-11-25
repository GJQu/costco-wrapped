import { useState } from "react";
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

// Helper functions

function computeMetrics(data) {
  const totalSpend = data.reduce((sum, r) => sum + (r.total || 0), 0);

  const itemCounts = {};
  const monthlyTotals = {};

  data.forEach((r) => {
    // Items per product name
    r.items?.forEach((item) => {
      const name = item.name;
      itemCounts[name] = (itemCounts[name] || 0) + (item.qty || 1);
    });

    // Monthly spend
    const month = r.date?.slice(0, 7) || "unknown"; // YYYY-MM
    monthlyTotals[month] = (monthlyTotals[month] || 0) + (r.total || 0);
  });

  const topItems = Object.entries(itemCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const monthlyLabels = Object.keys(monthlyTotals).sort();
  const monthlyValues = monthlyLabels.map((m) => monthlyTotals[m]);

  return {
    totalSpend,
    topItems,
    monthlyLabels,
    monthlyValues,
  };
}

// Main Component

export default function WrappedView({ data, onDone }) {
  const [slide, setSlide] = useState(0);
  const metrics = computeMetrics(data);

  const slides = [
    <SlideTotalSpend key="spend" metrics={metrics} />,
    <SlideTopItems key="top" metrics={metrics} />,
    <SlideMonthly key="monthly" metrics={metrics} />,
    <SlideFinished key="done" onDone={onDone} />,
  ];

  function next() {
    setSlide((s) => Math.min(s + 1, slides.length - 1));
  }

  function prev() {
    setSlide((s) => Math.max(s - 1, 0));
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl relative transition-all duration-500">
        {slides[slide]}
      </div>

      <div className="mt-10 flex gap-4">
        <button
          onClick={prev}
          disabled={slide === 0}
          className="px-5 py-2 rounded-lg bg-gray-200 disabled:opacity-50"
        >
          Back
        </button>

        <button
          onClick={next}
          disabled={slide === slides.length - 1}
          className="px-5 py-2 rounded-lg bg-costcoBlue text-white hover:bg-costcoRed transition disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

// ----------------------
// Individual Slides
// ----------------------

function SlideTotalSpend({ metrics }) {
  return (
    <div className="text-center animate-fadeIn">
      <h1 className="text-4xl font-bold text-costcoRed mb-6">Your 2024 Total</h1>
      <p className="text-6xl font-bold text-costcoBlue">
        ${metrics.totalSpend.toFixed(2)}
      </p>
      <p className="text-gray-600 mt-4">Really hope you're an Executive Member.</p>
    </div>
  );
}

function SlideTopItems({ metrics }) {
  return (
    <div className="text-center animate-fadeIn">
      <h2 className="text-3xl font-bold text-costcoBlue mb-6">Top Items</h2>

      <Bar
        data={{
          labels: metrics.topItems.map((i) => i[0]),
          datasets: [
            {
              label: "Quantity",
              data: metrics.topItems.map((i) => i[1]),
              backgroundColor: "#005CB9", // costcoBlue
            },
          ],
        }}
        options={{ responsive: true }}
      />
    </div>
  );
}

function SlideMonthly({ metrics }) {
  return (
    <div className="text-center animate-fadeIn">
      <h2 className="text-3xl font-bold text-costcoBlue mb-6">Monthly Spend</h2>

      <Line
        data={{
          labels: metrics.monthlyLabels,
          datasets: [
            {
              label: "Spend",
              data: metrics.monthlyValues,
              borderColor: "#DA1A32", // costcoRed
              backgroundColor: "rgba(218, 26, 50, 0.2)",
              tension: 0.3,
            },
          ],
        }}
        options={{ responsive: true }}
      />
    </div>
  );
}

function SlideFinished({ onDone }) {
  return (
    <div className="text-center animate-fadeIn">
      <h2 className="text-3xl font-bold text-costcoBlue mb-6">
        That’s your Costco Wrapped!
      </h2>

      <p className="text-gray-600 mb-8">
        Ready for a deeper dive into your shopping habits?
      </p>

      <button
        onClick={onDone}
        className="px-6 py-3 bg-costcoBlue text-white rounded-lg hover:bg-costcoRed transition"
      >
        View Full Dashboard
      </button>
    </div>
  );
}