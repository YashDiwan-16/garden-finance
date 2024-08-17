import React from "react";
import Navbar from "./components/Navbar";
import StarField from "./components/StarfieldBackground";
import HomePage from "./web3auth/AuthHomeButton";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ToBTCComponent from "./gardensdk/toBTCComponent";
const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-base-300 via-base-200 to-base-100 text-base-content overflow-hidden">
        <StarField />
        <div className="relative z-10">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/gardensdk" element={<ToBTCComponent />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
