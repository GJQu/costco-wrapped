function stripHashCodes(str) {
  if (!str) return str;
  return str.split("#")[0].trim();
}

function cleanName(desc1, desc2, itemNumber) {
  // Remove #codes
  const d1 = stripHashCodes(desc1);
  const d2 = stripHashCodes(desc2);

  const looksLikeSku =
    d1 &&
    /^[A-Z0-9]{6,}$/.test(d1.replace(/\s+/g, ""));

  if (d1 && !looksLikeSku) {
    return d1.trim();
  }

  if (d2 && !looksLikeSku) {
    return d2.trim();
  }

  if (d1 && d2) {
    return `${d1.trim()} — ${d2.trim()}`;
  }

  return d1 || d2 || itemNumber || "Unknown Item";
}

export function normalizeCostco(json) {
  return json.map((entry) => {
    const date =
      entry.transactionDate ||
      entry.transactionDateTime ||
      "";

    const total =
      entry.total ||
      entry.subTotal + entry.taxes ||
      0;

    const itemsRaw = entry.itemArray || [];

    const items = itemsRaw.map((it) => ({
      name: cleanName(
        it.itemDescription01,
        it.itemDescription02,
        it.itemNumber
      ),
      qty: it.unit || 1,
      price: it.amount || null,
    }));

    return {
      date,
      total,
      items,
    };
  });
}