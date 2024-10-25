import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slideshow from "./Slideshow";
import Prompt from "./Prompt";

const Rooms = () => {
  const [hotel, setHotel] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      setIsLoggedIn(true); 
      const fetchRooms = async () => {
        try {
          const res = await fetch("/rooms", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });

          if (!res.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await res.json();
          console.log(data);
          setHotel(data);
        } catch (error) {
          console.error("Error fetching rooms:", error);
        }
      };

      fetchRooms(); 
    }
  }, []);

  const images = [
    "https://images.unsplash.com/photo-1685592437742-3b56edb46b15?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1644057501622-dfa7dd26dbfb?q=80&w=1381&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  return (
    <div>
      <Slideshow
        images={images}
        interval={3000}
        title="Rooms"
        paragraph="Experience luxury and comfort like never before. Explore our exquisite rooms and enjoy our exceptional amenities."
      />
      <div className="p-4">
        <button className="mt-5 bg-slate-600 py-3 px-8 rounded hover:bg-amber-900">
          <Link to="/reservation">Book now</Link>
        </button>
        <h2 className="text-center text-5xl mt-24">Rooms</h2>

        <Prompt isAuthenticated={isLoggedIn} />
        
        {isLoggedIn ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
            {hotel.map((room) => (
              <div key={room.id} className="border rounded-lg shadow-lg overflow-hidden">
                <img
                  src={room.image}
                  alt={`Room ${room.room_number}`}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold">Room {room.room_number}</h3>
                  <p>Type: {room.room_type}</p>
                  <p>Price per night: ${room.price_per_night}</p>
                  <p>Status: {room.status}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-xl mt-8">
            You need to <Link to="/login" className="text-blue-600 hover:underline">log in</Link> to see the rooms.
          </p>
        )}
      </div>
    </div>
  );
};

export default Rooms;
