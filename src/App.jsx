import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import NavBar from "./component/NavBar";
import Home from "./component/Home";
import Rooms from "./component/Rooms";
import { Route, Routes } from "react-router-dom";
import About from "./component/About";
import Footer from "./component/Footer";
import Feedback from "./component/Feedback";
import Login from "./component/Login";
import Register from "./component/Register";
import Reservation from "./component/Reservation"
import Guest from "./component/Guest";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <NavBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/reservations" element={<Reservation />} />
        <Route path="/about" element={<About />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/guests" element={<Guest/>} />
      </Routes>
      <Footer />
    </>
  );
}
export default App;
