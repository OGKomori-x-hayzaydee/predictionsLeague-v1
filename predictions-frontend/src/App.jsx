import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Theme } from "@radix-ui/themes";
import { ThemeProvider } from "./context/ThemeContext";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import HowToPlay from "./pages/HowToPlay";
import Home from "./pages/Home";


function App() {
  return (
    <ThemeProvider>
        <Theme>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/howToPlay" element={<HowToPlay />} />
              <Route path="/home" element={<Navigate to="/home/dashboard" replace />} />
              <Route path="/home/:view" element={<Home />} />
            </Routes>
        </Theme>
    </ThemeProvider>
  );
}

export default App;
