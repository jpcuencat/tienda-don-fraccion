import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import PizzaSimulatorPage from "./pages/PizzaSimulatorPage";
import SlideDeckPage from "./pages/SlideDeckPage";
import StaircasePage from "./pages/StaircasePage";
import DonFraccionPage from "./pages/DonFraccionPage";
import PresentationAdminPage from "./pages/PresentationAdminPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas principales (sin acceso admin visible) */}
        <Route 
          path="/" 
          element={
            <Layout>
              <Home />
            </Layout>
          } 
        />
        
        {/* Rutas de actividades educativas (con acceso rápido al admin) */}
        <Route 
          path="/pizza" 
          element={
            <Layout showAdminAccess={true}>
              <PizzaSimulatorPage />
            </Layout>
          } 
        />
        <Route 
          path="/fracciones" 
          element={
            <Layout showAdminAccess={true}>
              <SlideDeckPage />
            </Layout>
          } 
        />
        <Route 
          path="/escalera" 
          element={
            <Layout showAdminAccess={true}>
              <StaircasePage />
            </Layout>
          } 
        />
        <Route 
          path="/don-fraccion" 
          element={
            <Layout showAdminAccess={true}>
              <DonFraccionPage />
            </Layout>
          } 
        />
        
        {/* Rutas administrativas */}
        <Route 
          path="/admin/presentations" 
          element={
            <Layout>
              <PresentationAdminPage />
            </Layout>
          } 
        />
      </Routes>
    </Router>
  );
}


export default App;




