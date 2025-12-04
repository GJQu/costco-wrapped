# 🛒 Costco Wrapped — Personal Purchase Analytics Dashboard

Costco Wrapped is a local-first React + Vite application that turns your exported Costco digital receipts into a personalized analytics experience — inspired by Spotify Wrapped.

This project was built to explore:
- Data normalization and schema transformation  
- Client-side analytics pipelines  
- Interactive React visualizations  
- A fun, narrative-driven dashboard experience  

Everything runs **entirely on your device**. No data is uploaded or stored remotely.

---

## ✨ Features

### Wrapped-Style Story Experience
Once you upload your Costco JSON receipts, the app generates a slideshow summarizing your year:
- Total yearly spend  
- Top purchased items  
- Monthly spending pattern  
- Top categories  
- “Costco Food Court Vibe” (fun hash-based personality assignment)  
- Your most expensive day of the year  
- Final transition into the full analytics dashboard  

Beautiful Costco-themed colors, animations, and a smooth flow between slides.

---

## 📊 Deep-Dive Dashboard

After the Wrapped slideshow, you unlock a full analytics dashboard with:

### **KPI Summary**
- Total receipts  
- Total unique items  
- Total items purchased  
- Total spent  

### **Where Your Money Went**
A bar chart showing **spending by category**, using a custom categorization engine (meat, produce, snacks, supplements, etc.).  
“Miscellaneous” is automatically removed to keep the chart meaningful.

### **Top 10 Most Purchased Items**
Cleaned and normalized item names (removing “ORG”, “ORGANIC”, etc.).

### **Repeat Purchases (Loyalty Items)**
Shows which items you buy most consistently across months.

### **Price Trends & Inflation Table**
- Min price  
- Max price  
- Dollar increase  
For each item with multiple purchase points.

### **Most Expensive Days**
Top 5 biggest Costco days — for accountability or nostalgia.

---

## 📦 JSON Schema Normalization

Costco’s export format is very noisy and inconsistent.  
This project includes a custom parser (`normalizeCostco.js`) that converts raw receipts into a stable, app-friendly schema:

```js
{
  date: "2025-04-16",
  total: 142.75,
  items: [
    { name: "KS SLIPPERS", qty: 2, price: 115.78 },
    { name: "BEEF ROLLS", qty: 1, price: 14.99 }
  ]
}
``` 

Key steps:
	•	Merge itemDescription01 + itemDescription02
	•	Clean SKU from names
	•	Strip ORGANIC / ORG
	•	Ensure quantity and price validity
	•	Remove trailing numbers after “#”

⸻

## 🧠 Analytics Engine

Analytics are computed client-side in:

src/utils/computeDashboardMetrics.js

This module computes:
	•	Category totals
	•	Item-level aggregations
	•	Monthly spend
	•	Repeat purchases
	•	Price variation
	•	Most expensive dates

It powers both the Wrapped slideshow and Dashboard.

⸻

## 🧰 Tech Stack

Area	Library / Tool
Frontend Framework	React (JSX)
Build Tool	Vite
Styling	TailwindCSS
Charts & Visualization	Chart.js + react-chartjs-2
State Handling	React Hooks
Data Parsing	Custom JS normalization utilities

Everything is written in plain JS/JSX for portability and clarity.

⸻

## 🚀 Running the Project

Install

npm install

Run Dev Server

npm run dev

Build for Production

npm run build


⸻

## 📁 Project Structure

src/
  components/
    UploadScreen.jsx
    WrappedView.jsx
    DashboardView.jsx
  utils/
    normalizeCostco.js
    computeDashboardMetrics.js
  App.jsx
  main.jsx


⸻

## Privacy & Data Handling
	•	Your Costco data never leaves your machine
	•	No API calls or external storage
	•	Everything is processed live in your browser session

⸻

## 🎨 Design Language

Custom Costco-themed palette defined in Tailwind:

costcoBlue: "#005CB9",
costcoRed: "#DA1A32"

UI is intentionally minimal, bold, and chart-driven.

⸻

## Roadmap

Planned or possible next enhancements:
	•	Filters: year, warehouse, categories
	•	Heatmap of spending by weekday
	•	Costco persona generator badge
	•	Exportable summary image for social sharing
	•	Mobile Wrapped flow (vertical swipe UX)

⸻

## License

Apache License 2.0