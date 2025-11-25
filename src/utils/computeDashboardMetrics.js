export function computeDashboardMetrics(data) {
  const itemStats = {};
  const monthly = {};
  let totalSpent = 0;
  let totalItems = 0;

  data.forEach((receipt) => {
    const receiptTotal = receipt.total || 0;
    const date = receipt.date || "";
    const month = date.slice(0, 7);

    totalSpent += receiptTotal;
    monthly[month] = (monthly[month] || 0) + receiptTotal;

    receipt.items.forEach((item) => {
      totalItems += item.qty || 1;

      if (!itemStats[item.name]) {
        itemStats[item.name] = {
          name: item.name,
          qty: 0,
          totalSpent: 0,
          prices: [],
          dates: []
        };
      }

      const record = itemStats[item.name];

      record.qty += item.qty || 1;
      record.totalSpent += item.price || 0;
      record.prices.push(item.price || 0);
      record.dates.push(date);
    });
  });

  const uniqueItems = Object.keys(itemStats).length;
  const receipts = data.length;

  const mostPurchased = Object.values(itemStats)
    .sort((a, b) => b.qty - a.qty);

  const mostExpensive = Object.values(itemStats)
    .map((it) => ({
      ...it,
      avgPrice: it.totalSpent / it.prices.length,
      maxPrice: Math.max(...it.prices),
    }))
    .sort((a, b) => b.avgPrice - a.avgPrice);

  const mostTotalSpent = Object.values(itemStats)
    .sort((a, b) => b.totalSpent - a.totalSpent);

  const priceIncreases = Object.values(itemStats)
    .map((it) => {
      const min = Math.min(...it.prices);
      const max = Math.max(...it.prices);
      const increase = max - min;

      const sortedDates = it.dates.filter(Boolean).sort();
      let periodMonths = 0;

      if (sortedDates.length >= 2) {
        const first = new Date(sortedDates[0]);
        const last = new Date(sortedDates[sortedDates.length - 1]);
        periodMonths = (last - first) / (1000 * 60 * 60 * 24 * 30.5);
      }

      const ratePerMonth = periodMonths ? increase / periodMonths : 0;

      return {
        ...it,
        minPrice: min,
        maxPrice: max,
        increase,
        periodMonths,
        ratePerMonth
      };
    })
    .sort((a, b) => b.increase - a.increase);

  return {
    totalSpent,
    totalItems,
    uniqueItems,
    receipts,
    itemStats,
    mostPurchased,
    mostExpensive,
    mostTotalSpent,
    priceIncreases,
    monthly
  };
}