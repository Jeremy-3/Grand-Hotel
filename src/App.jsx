import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import NavBar from "./component/NavBar";
import Home from "./component/Home";
import Rooms from "./component/Rooms";
import { Route, Routes } from "react-router-dom";
import FormData from "./component/FormData";
import About from "./component/About";
import Footer from "./component/Footer";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <NavBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/contact" element={<FormData />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
    </>
  );
}
export default App;
