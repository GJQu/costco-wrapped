function cleanName(name) {
  return name
    .replace(/\bORG\b/gi, "")
    .replace(/\bORGANIC\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

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

export function computeDashboardMetrics(data) {
  const itemStats = {};     // name → aggregates
  const categoryTotals = {}; 
  const monthly = {};
  const warehouseTotals = {};
  const dayTotals = {};

  let totalSpent = 0;
  let totalItems = 0;

  data.forEach((receipt) => {
    const date = receipt.date;
    const month = date.slice(0, 7);
    const warehouse = receipt.warehouseName || "Unknown";

    totalSpent += receipt.total;
    monthly[month] = (monthly[month] || 0) + receipt.total;
    dayTotals[date] = (dayTotals[date] || 0) + receipt.total;
    warehouseTotals[warehouse] = (warehouseTotals[warehouse] || 0) + receipt.total;

    receipt.items.forEach((item) => {
      totalItems += item.qty;

      // initialize item record
      const cleaned = cleanName(item.name);

      if (!itemStats[cleaned]) {
        itemStats[cleaned] = {
          name: cleaned,
          qty: 0,
          totalSpent: 0,
          prices: [],
          dates: []
        };
      }

      const rec = itemStats[cleaned];

      // aggregate
      rec.qty += item.qty;
      rec.totalSpent += item.price;
      rec.prices.push(item.price);
      rec.dates.push(date);

      // categorize
      const cat = categorizeItem(item.name);
      categoryTotals[cat] = (categoryTotals[cat] || 0) + item.price;
    });
  });

  const receipts = data.length;
  const uniqueItems = Object.keys(itemStats).length;

  // Top items by quantity
  const mostPurchased = Object.values(itemStats)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 10);

  // Repeat purchases by number of distinct months
  const repeatPurchases = Object.values(itemStats)
    .map((it) => ({
      name: it.name,
      months: new Set(it.dates.map(d => d.slice(0, 7))).size,
      qty: it.qty
    }))
    .sort((a, b) => b.months - a.months)
    .slice(0, 10);

  // Price changes
  const priceIncreases = Object.values(itemStats)
    .filter(it => it.prices.length > 1)
    .map((it) => ({
      name: it.name,
      minPrice: Math.min(...it.prices),
      maxPrice: Math.max(...it.prices),
      increase: Math.max(...it.prices) - Math.min(...it.prices)
    }))
    .sort((a, b) => b.increase - a.increase)
    .slice(0, 10);

  // Category sorted
  const categoryBreakdown = Object.entries(categoryTotals)
    .filter(([cat]) => cat !== "Miscellaneous")   // remove miscellaneous
    .sort((a, b) => b[1] - a[1]);

  // Top 5 expensive days
  const expensiveDays = Object.entries(dayTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return {
    totalSpent,
    totalItems,
    receipts,
    uniqueItems,
    monthly,
    categoryBreakdown,
    mostPurchased,
    repeatPurchases,
    priceIncreases,
    warehouseTotals,
    expensiveDays
  };
}