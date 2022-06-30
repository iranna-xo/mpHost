import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import DashBoard from "./Pages/dashBoard";
import ErrorFunction from "./Pages/ErrorPage";
import LoginFunction from "./Pages/signUp";
import SignInFunction from "./Pages/signIn";
//main routing
function App() {
  return (
    <Router>
    
      <div >
      <Routes>
        <Route path="/" element={<LoginFunction />} />
        <Route path="/signIn" element={<SignInFunction />} />
        <Route path="/dashBoard/:userName" element={<DashBoard />} />
        <Route path="*" element={<ErrorFunction />} />
      </Routes>
      </div>
      
    </Router>
  );
}

export default App;
