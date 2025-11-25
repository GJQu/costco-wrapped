import { useState } from "react";
import UploadScreen from "./components/UploadScreen";
import WrappedView from "./components/WrappedView";
import DashboardView from "./components/DashboardView";

function App() {
  const [data, setData] = useState(null);
  const [mode, setMode] = useState("upload"); 
  // modes: upload → wrapped → dashboard

  const handleLoaded = (normalized) => {
    if (Array.isArray(normalized)) {
      setData(normalized);
      setMode("wrapped");   // go straight into the Wrapped slideshow
    }
  };

  return (
    <>
      {mode === "upload" && (
        <UploadScreen onDataLoaded={handleLoaded} />
      )}

      {mode === "wrapped" && data && (
        <WrappedView 
          data={data} 
          onDone={() => setMode("dashboard")} 
        />
      )}

      {mode === "dashboard" && data && (
        <DashboardView data={data} />
      )}
    </>
  );
}

export default App;