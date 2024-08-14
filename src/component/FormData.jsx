import React, { useEffect, useState } from "react";
import Form from "./Form";

function FormData() {
  
  const [bookings, setBookings] = useState([]);
  const [newBookings, setNewBookings] = useState({
    roomId: "",
    userId: "",
    roomType: "",
    checkIn: "",
    checkOut: "",
    status: "pending", //Default status
  });
  useEffect(() => {
    fetch("http://localhost:3000/hotel")
      .then((res) => res.json())
      .then((data) => setBookings(data.bookings))
      .catch((error) => console.log("Can NOT Fetch", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBookings({ ...newBookings, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    const bookingData = {
      roomId: newBookings.roomId,
      userId: newBookings.userId,
      checkIn: newBookings.checkIn,
      checkOut: newBookings.checkOut,
      status: newBookings.status,
    };

    fetch("http://localhost:3000/hotel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    })
      .then((res) => res.json())
      .then((data) => setBookings((prevBookings) => [...prevBookings, data]))
      .catch((error) => console.log("Error", error));

    setNewBookings({
      roomId: "",
      roomType: "",
      checkIn: "",
      checkOut: "",
      userId: "",
      status: "pending",
    });
  };

  return (
    <div className="background-container">
      <div className="max-w-4xl max-auto p-6">
        <h1 className="header">Bookings</h1>
        <hr className="my-4" />

        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li
              key={booking.id}
              className="p-4 border border-gray-300 rounded-lg shadow-sm bg-slate-200 "
            >
              <h2 className="text-xl font-semibold text-gray-800">
                Room ID: {booking.roomId}
              </h2>
              <p className="text-gray-600">Room Type: {booking.type}</p>
              <p className="text-gray-600">Check-In: {booking.checkIn}</p>
              <p className="text-gray-600">Check-Out: {booking.checkOut}</p>
              <p className="text-gray-600">User ID: {booking.userId}</p>
              <p className="text-gray-600">Status: {booking.status}</p>
            </li>
          ))}
        </ul>
        <div>
          <Form
            newBookings={newBookings}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}

export default FormData;
