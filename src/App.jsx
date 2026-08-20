import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import Reservations from "./pages/Reservations";
import GuestManagement from "./pages/GuestManagement";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Feedback from "./pages/Feedback";
import Superadmin from "./pages/Superadmin";

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-950 text-gray-100 flex flex-col justify-between selection:bg-gold-500 selection:text-black">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/about" element={<About />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/guests" element={<GuestManagement />} />
            <Route path="/admin" element={<Superadmin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
