import { useState, useCallback } from "react";
import { normalizeCostco } from "../utils/normalizeCostco";

export default function UploadScreen({ onDataLoaded }) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  const handleFile = useCallback(
    async (file) => {
      if (!file) return;

      try {
        const text = await file.text();
        const json = JSON.parse(text);

        if (!Array.isArray(json)) {
          setError("Invalid Costco receipt JSON format.");
          return;
        }

        const normalized = normalizeCostco(json);

        setError("");
        onDataLoaded(normalized);
      } catch (err) {
        setError("Could not parse JSON.");
      }
    },
    [onDataLoaded]
  );

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">

      <h1 className="text-4xl font-bold text-costcoBlue mb-8">
        Costco Wrapped
      </h1>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`w-full max-w-xl border-4 border-dashed rounded-2xl p-12 text-center cursor-pointer transition
          ${dragging ? "border-costcoBlue bg-blue-50" : "border-gray-300 bg-white"}
        `}
      >
        <p className="text-xl text-gray-700 mb-4">
          Drag & drop your Costco JSON file
        </p>
        <p className="text-sm text-gray-500">or click to browse</p>

        <input
          type="file"
          accept=".json"
          className="opacity-0 absolute inset-0 cursor-pointer"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>

      {error && (
        <p className="mt-4 text-costcoRed font-semibold">{error}</p>
      )}

      <p className="text-sm text-gray-500 mt-6 max-w-md text-center">
        Your data never leaves your device. Everything is processed locally.
      </p>
    </div>
  );
}