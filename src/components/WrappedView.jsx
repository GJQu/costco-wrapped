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

function categorizeItem(name) {
  const n = name.toLowerCase();

  if (n.includes("chicken") || n.includes("beef") || n.includes("pork")) return "Meat";
  if (n.includes("salmon") || n.includes("shrimp") || n.includes("fish")) return "Seafood";
  if (n.includes("milk") || n.includes("cheese") || n.includes("yogurt")) return "Dairy";
  if (n.includes("bread") || n.includes("roll") || n.includes("bagel")) return "Bakery";
  if (n.includes("wine") || n.includes("beer") || n.includes("vodka")) return "Alcohol";
  if (n.includes("apple") || n.includes("banana") || n.includes("berry") || n.includes("fruit")) return "Produce";
  if (n.includes("lettuce") || n.includes("salad") || n.includes("veggie") || n.includes("vegetable")) return "Produce";
  if (n.includes("snack") || n.includes("chips") || n.includes("cracker")) return "Snacks";
  if (n.includes("vitamin") || n.includes("supplement")) return "Supplements";
  if (n.includes("kirkland")) return "KS Essentials";

  return "Miscellaneous";
}

function computeMetrics(data) {
  const totalSpend = data.reduce((sum, r) => sum + (r.total || 0), 0);

  const itemCounts = {};
  const categoryCounts = {};
  const monthlyTotals = {};

  data.forEach((r) => {
    // Items per product name
    r.items?.forEach((item) => {
      const name = item.name;
      itemCounts[name] = (itemCounts[name] || 0) + (item.qty || 1);
      const category = categorizeItem(name);
      categoryCounts[category] = (categoryCounts[category] || 0) + (item.qty || 1);
    });
    
    // Monthly spend
    const month = r.date?.slice(0, 7) || "unknown"; // YYYY-MM
    monthlyTotals[month] = (monthlyTotals[month] || 0) + (r.total || 0);
  });

  // Top Categories 
  const topCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const topItems = Object.entries(itemCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const monthlyLabels = Object.keys(monthlyTotals).sort();
  const monthlyValues = monthlyLabels.map((m) => monthlyTotals[m]);

  // --- Most Expensive Day ---
  const spendByDate = {};

  data.forEach((r) => {
    const date = r.date || "unknown";
    spendByDate[date] = (spendByDate[date] || 0) + (r.total || 0);
  });

  let mostExpensiveDay = null;
  let mostExpensiveValue = 0;

  Object.entries(spendByDate).forEach(([date, amount]) => {
    if (amount > mostExpensiveValue) {
      mostExpensiveValue = amount;
      mostExpensiveDay = date;
    }
  });

  return {
    totalSpend,
    topItems,
    topCategories,
    monthlyLabels,
    monthlyValues,
    mostExpensiveDay, 
    mostExpensiveValue
  };
}

// Main Component

export default function WrappedView({ data, onDone }) {
  const [slide, setSlide] = useState(0);
  const metrics = computeMetrics(data);

  const DELI_ITEMS = [
  "Chicken Bake 🍗",
  "$1.50 Hot Dog 🌭",
  "Combo Pizza 🍕",
  "Pepperoni Pizza 🍕",
  "Cheese Pizza 🍕",
  "Sundae 🍦",
  "Chicken Caesar Salad 🥗"
  ];

  function pickDeliFavorite(totalSpend) {
    // simple hash fn using mod
    const index = Math.abs(Math.floor(totalSpend)) % DELI_ITEMS.length;
    return DELI_ITEMS[index];
  }

  function SlideDeliFavorite({ metrics }) {
    const favorite = pickDeliFavorite(metrics.totalSpend);

    return (
      <div className="text-center animate-fadeIn">
        <h2 className="text-3xl font-bold text-costcoBlue mb-6">
          Your Costco Food Court Vibe
        </h2>

        <p className="text-6xl font-extrabold text-costcoRed mb-4">
          {favorite}
        </p>

        <p className="text-gray-600 text-lg">
          Based on your Costco personality, we think this is your<br />
          <span className="font-semibold">food court soulmate.</span>
        </p>
      </div>
    );
  }

  function SlideTopCategories({ metrics }) {
    const cats = metrics.topCategories;

    return (
      <div className="text-center animate-fadeIn">
        <h2 className="text-3xl font-bold text-costcoBlue mb-10">
          Your Top Costco Categories
        </h2>

        <div className="flex flex-col items-center gap-4">
          {cats.map(([name, count], i) => (
            <div
              key={name}
              className="text-4xl font-extrabold"
              style={{
                color: i === 0 ? "#DA1A32" : "#005CB9",
              }}
            >
              {i + 1}. {name}  
              <span className="text-gray-500 text-xl font-normal">— {count}</span>
            </div>
          ))}
        </div>

        <p className="text-gray-600 mt-6">
          #2025Wrapped
        </p>
      </div>
    );
  }

  function SlideMostExpensiveDay({ metrics }) {
    const { mostExpensiveDay, mostExpensiveValue } = metrics;

    // Format date nicely
    const prettyDate = mostExpensiveDay
      ? new Date(mostExpensiveDay).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "Unknown Date";

    return (
      <div className="text-center animate-fadeIn">
        <h2 className="text-3xl font-bold text-costcoBlue mb-6">
          Your Most Expensive Costco Day
        </h2>

        <p className="text-costcoRed text-6xl font-extrabold mb-4">
          ${mostExpensiveValue.toFixed(2)}
        </p>

        <p className="text-2xl font-bold text-costcoBlue mb-2">
          {prettyDate}
        </p>

        <p className="text-gray-600 text-lg">
          Something big happened that day…
        </p>
      </div>
    );
  }

  const slides = [
    <SlideTotalSpend key="spend" metrics={metrics} />,
    <SlideTopCategories key="cats" metrics={metrics} />,
    <SlideTopItems key="top" metrics={metrics} />,
    <SlideMonthly key="monthly" metrics={metrics} />,
    <SlideMostExpensiveDay key="expday" metrics={metrics} />,
    <SlideDeliFavorite key="deli" metrics={metrics} />,
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
      <p className="text-gray-600 mt-4">Hope you're an Executive Member! 🫣</p>
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