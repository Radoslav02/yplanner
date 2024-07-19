import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login/Login";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./components/Home/Home";
import Statistics from "./components/Statistics/Statistics";
import Finished from "./components/Finished/Finished";
import Customers from "./components/Customers/Customers";
import Materials from "./components/Materials/Materials";

function App() {
  return (
    <div className="app-container">
      <BrowserRouter>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          transition={Zoom}
        />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/statistics" element = {<Statistics />} />
          <Route path="/finished" element = {<Finished />} />
          <Route path="/customers" element = {<Customers />} />
          <Route path="/materials" element = {<Materials />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
