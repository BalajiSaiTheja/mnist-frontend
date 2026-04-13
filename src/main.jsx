import { createContext, StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { RetroGrid } from "@/components/ui/retro-grid"
import { LightRays } from "@/components/ui/light-rays"
import { TracingBeam } from './Components/ui/tracing-beam'

import './index.css'
import App from './App.jsx'
export const predictionContext = createContext();

function Wrapper() {
  const [prediction, setPrediction] = useState(null);

  return (
    <div className="relative min-h-screen w-screen overflow-x-hidden">
      <div className="fixed inset-0 -z-10 h-full w-full [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#e0d7ff_100%)] pointer-events-none">
        <LightRays />
        <RetroGrid opacity={0.1} />
      </div>
      
      <predictionContext.Provider value={{ prediction, setPrediction }}>
        <App />
      </predictionContext.Provider>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Wrapper />
  </StrictMode>,
)
