import { Bar } from "react-chartjs-2";
import { computeDashboardMetrics } from "../utils/computeDashboardMetrics";

export default function DashboardView({ data, onBack }) {
  const metrics = computeDashboardMetrics(data);

  return (
    <div className="min-h-screen w-full bg-gray-50 px-8 py-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-bold text-costcoBlue">
            Dashboard View 📊
        </h1>

        <button
          onClick={onBack}
          className="px-4 py-2 bg-costcoRed text-white rounded-md shadow hover:bg-red-700 transition"
        >
          ← Back to Wrapped
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <KpiCard label="Total Receipts" value={metrics.receipts} />
        <KpiCard label="Total Items" value={metrics.totalItems} />
        <KpiCard label="Unique Items" value={metrics.uniqueItems} />
        <KpiCard 
          label="Total Spent" 
          value={`$${metrics.totalSpent.toFixed(2)}`} 
        />
      </div>

      {/* Spend by Category */}
      <CategorySpendChart metrics={metrics} />

      {/* Top Items */}
      <TopPurchasedTable metrics={metrics} />

      {/* Repeat Purchases */}
      <RepeatPurchaseTable metrics={metrics} />

      {/* Price Trends */}
      <PriceIncreaseTable metrics={metrics} />

      {/* Expensive Days */}
      <ExpensiveDaysTable metrics={metrics} />

      <div className="text-center text-gray-400 mt-20 pb-10">
        Dashboard generated locally. Your Costco data stays private.
      </div>
    </div>
  );
}

/* ---------------------- */
/* KPI CARD COMPONENT */
/* ---------------------- */
function KpiCard({ label, value }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border-t-4 border-costcoBlue">
      <p className="text-costcoBlue font-semibold text-sm">{label}</p>
      <p className="text-3xl font-bold text-costcoRed mt-1">{value}</p>
    </div>
  );
}

/* A — Spend by Category Chart */
function CategorySpendChart({ metrics }) {
  const labels = metrics.categoryBreakdown.map(([cat]) => cat);
  const values = metrics.categoryBreakdown.map(([, total]) => total);

  return (
    <div className="p-6 bg-white rounded-xl shadow mb-12">
      <h2 className="text-2xl font-bold text-costcoBlue mb-6">
        Where Your Money Went
      </h2>

      <Bar
        data={{
          labels,
          datasets: [
            {
              label: "Total Spent ($)",
              data: values,
              backgroundColor: "#005CB9",
            },
          ],
        }}
        options={{ responsive: true }}
      />
    </div>
  );
}

/* B — Top Purchased Items */
function TopPurchasedTable({ metrics }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow mb-12 overflow-x-auto">
      <h2 className="text-2xl font-bold text-costcoBlue mb-4">
        Your Most Purchased Items
      </h2>

      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="py-2">Item</th>
            <th>Quantity</th>
            <th>Total Spent</th>
          </tr>
        </thead>
        <tbody>
          {metrics.mostPurchased.map((it) => (
            <tr key={it.name} className="border-b">
              <td className="py-2">{it.name}</td>
              <td>{it.qty}</td>
              <td>${it.totalSpent.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* C — Repeat Purchases */
function RepeatPurchaseTable({ metrics }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow mb-12 overflow-x-auto">
      <h2 className="text-2xl font-bold text-costcoBlue mb-4">
        Your Most Loyal Items
      </h2>

      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="py-2">Item</th>
            <th>Months Purchased</th>
            <th>Total Qty</th>
          </tr>
        </thead>
        <tbody>
          {metrics.repeatPurchases.map((it) => (
            <tr key={it.name} className="border-b">
              <td className="py-2">{it.name}</td>
              <td>{it.months}</td>
              <td>{it.qty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* D — Price Increases */
function PriceIncreaseTable({ metrics }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow mb-12 overflow-x-auto">
      <h2 className="text-2xl font-bold text-costcoBlue mb-4">
        Items with the Biggest Price Jumps
      </h2>

      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="py-2">Item</th>
            <th>Min Price</th>
            <th>Max Price</th>
            <th>Increase</th>
          </tr>
        </thead>
        <tbody>
          {metrics.priceIncreases.map((it) => (
            <tr key={it.name} className="border-b">
              <td className="py-2">{it.name}</td>
              <td>${it.minPrice.toFixed(2)}</td>
              <td>${it.maxPrice.toFixed(2)}</td>
              <td>${it.increase.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* E — Warehouse Breakdown */

/* F — Expensive Days */
function ExpensiveDaysTable({ metrics }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow mb-12 overflow-x-auto">
      <h2 className="text-2xl font-bold text-costcoBlue mb-4">
        Your Top 5 Most Expensive Days
      </h2>

      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="py-2">Date</th>
            <th>Total Spent</th>
          </tr>
        </thead>
        <tbody>
          {metrics.expensiveDays.map(([date, value]) => (
            <tr key={date} className="border-b">
              <td className="py-2">{date}</td>
              <td>${value.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}