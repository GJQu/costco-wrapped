import { computeDashboardMetrics } from "../utils/computeDashboardMetrics";

export default function DashboardView({ data, onBack }) {
  const metrics = computeDashboardMetrics(data);

  return (
    <div className="min-h-screen w-full bg-gray-50 px-8 py-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-bold text-costcoBlue">
          Costco Dashboard
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
        <div className="p-6 bg-white rounded-xl shadow-lg border-t-4 border-costcoBlue">
          <p className="text-costcoBlue font-semibold text-sm">Total Receipts</p>
          <p className="text-3xl font-bold text-costcoRed">{metrics.receipts}</p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow-lg border-t-4 border-costcoBlue">
          <p className="text-costcoBlue font-semibold text-sm">Total Items</p>
          <p className="text-3xl font-bold text-costcoRed">{metrics.totalItems}</p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow-lg border-t-4 border-costcoBlue">
          <p className="text-costcoBlue font-semibold text-sm">Unique Items</p>
          <p className="text-3xl font-bold text-costcoRed">{metrics.uniqueItems}</p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow-lg border-t-4 border-costcoBlue">
          <p className="text-costcoBlue font-semibold text-sm">Total Spent</p>
          <p className="text-3xl font-bold text-costcoRed">
            ${metrics.totalSpent.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Future Sections Go Here */}
      <div className="text-gray-500 text-center mt-20">
        More analytics coming soon…
      </div>

    </div>
  );
}