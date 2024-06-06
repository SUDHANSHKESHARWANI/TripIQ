import React from 'react'
import "./App.css";
import Home from "./components/Home";
import InputPage from "./components/InputPage";
import Itinerary from "./components/Itinerary";
import Footer from "./components/Footer"
import { BrowserRouter as Router,Route,Routes } from "react-router-dom";
import Description from "./components/Description"
import { DarkModeProvider } from './components/DarkModeContext';

const App = () => {
  
  return (
    <DarkModeProvider>
      <Router>
        <div className="min-h-screen flex-col items-center justify-center bg-white dark:bg-slate-950 transition-colors duration-300 overflow-x-hidden">
         <div className="w-full flex justify-between items-center p-4">
            <Description />
          </div>
          <div className="flex-grow flex items-center justify-center w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/input" element={<InputPage />} />
              <Route path="/itinerary" element={<Itinerary />} />
            </Routes>
          </div>
          <div className="w-full flex justify-between items-center p-4">
            <Footer />
          </div>
        </div>
      </Router>
    </DarkModeProvider>
  )
}

export default App
