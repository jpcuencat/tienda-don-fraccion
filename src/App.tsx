import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PizzaSimulatorPage from "./pages/PizzaSimulatorPage";
import SlideDeckPage from "./pages/SlideDeckPage";
import StaircasePage from "./pages/StaircasePage";
import DonFraccionPage from "./pages/DonFraccionPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pizza" element={<PizzaSimulatorPage />} />
        <Route path="/fracciones" element={<SlideDeckPage />} />       
        <Route path="/escalera" element={<StaircasePage />} /> 
        <Route path="/don-fraccion" element={<DonFraccionPage />} />
      </Routes>
    </Router>
  );
}


export default App;




