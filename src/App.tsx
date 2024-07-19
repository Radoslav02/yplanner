import {
  BrowserRouter,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Router,
  Routes,
} from "react-router-dom";
import Login from "./components/Login/Login";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./components/Home/Home";
import Statistics from "./components/Statistics/Statistics";

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
          <Route path="/" element={<Login />}  />
          <Route path="/home" element={<Home />} />
          <Route path="/statistics" element = {<Statistics />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
