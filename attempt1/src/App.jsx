import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Theme } from "@radix-ui/themes";
import { ThemeProvider } from "./context/ThemeContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import HowToPlay from "./pages/HowToPlay";
import Dashboard from "./pages/Dashboard";
import Matches from "./pages/Matches";

function App() {
  return (
    <ThemeProvider>
      <Theme>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/howToPlay" element={<HowToPlay/>}/>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/matches" element={<Matches />} />
        </Routes>
      </Theme>
    </ThemeProvider>
  );
}

export default App;
