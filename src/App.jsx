import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-5xl font-bold text-costcoRed mb-6">
        Costco Wrapped
      </h1>

      <p className="text-lg text-costcoBlue">
        If you see red + blue, Tailwind + custom colors are working.
      </p>

      <button className="mt-8 px-6 py-3 rounded-lg bg-costcoBlue text-white hover:bg-costcoRed transition">
        Test Button
      </button>
    </div>
  );
}

export default App
