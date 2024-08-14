import React, { useEffect, useState } from "react";
import Form from "./Form";

function FormData() {
  const [bookings, setBookings] = useState([]);
  const [newBookings, setNewBookings] = useState({
    roomId: "",
    userId: "",
    checkIn: "",
    checkOut: "",
    status: "pending", // Default status
  });

  useEffect(() => {
    fetch("http://localhost:3000/bookings")
      .then((res) => {
        if (!res.ok) {
          return res.text().then((text) => { throw new Error(text); });
        }
        return res.json();
      })
      .then((data) => {
        // Ensure that bookings is an array
        setBookings(Array.isArray(data.bookings) ? data.bookings : []);
      })
      .catch((error) => console.log("Can NOT Fetch:", error.message));
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

    fetch("http://localhost:3000/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((text) => { throw new Error(text); });
        }
        return res.json();
      })
      .then((data) => setBookings((prevBookings) => [...prevBookings, data]))
      .catch((error) => console.log("Error Posting:", error.message));

    setNewBookings({
      roomId: "",
      checkIn: "",
      checkOut: "",
      userId: "",
      status: "pending",
    });
  };

  return (
    <div className="bg-[url('https://images.unsplash.com/photo-1535827841776-24afc1e255ac?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzl8fGhvdGVsJTIwYm9va2luZyUyMGJhY2slMjBncm91bmR8ZW58MHx8MHx8fDA%3D')] bg-cover bg-center min-h-screen flex items-center justify-center">
      <div className="max-w-4xl mx-auto p-6 bg-slate-50 bg-opacity-80 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Welcome to the Booking Page</h1>
        <hr className="my-4 border-gray-300" />
        
        {/* Hotel Policies */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-semibold mb-4 text-gray-700">Hotel Policies</h2>
          <p className="text-lg leading-relaxed text-gray-600">
            Check-In Time: 3:00 PM. Check-Out Time: 11:00 AM. Early check-in and late check-out may be available upon request.
            Cancellation Policy: Free cancellation up to 24 to 48 hours before the check-in date. Non-Refundable Rates require full payment at the time of booking. Specific policies apply for group bookings.
            Modification Policy: Changes to bookings are subject to availability and may incur additional charges.
            Payment Policy: Accepted Payment Methods include major credit cards and sometimes cash. Some reservations may require prepayment or a deposit. A credit card may be required at check-in for incidentals.
            Smoking Policy: Non-smoking rooms are available. Smoking in non-smoking rooms may incur a cleaning fee.
            Pet Policy: Pets are allowed in specific rooms with additional fees. A refundable deposit may be required.
            Accessibility Policy: Accessible rooms and facilities are available. Request in advance.
            Privacy Policy: Details on data protection and sharing practices.
            Behavior and Conduct: Guests are expected to maintain noise levels and behavior. Violations may result in eviction.
            Lost and Found: Report lost items to the front desk. Items are stored for a specific period.
          </p>
        </div>
  
        {/* Bookings List */}
        <div className="flex flex-col items-center">
          <ul className="space-y-4 w-full">
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <li key={booking.id} className="p-4 border border-gray-300 rounded-lg shadow-sm bg-slate-200 w-full">
                  <h2 className="text-xl font-semibold text-gray-800">Room ID: {booking.roomId}</h2>
                  <p className="text-gray-600">Check-In: {booking.checkIn}</p>
                  <p className="text-gray-600">Check-Out: {booking.checkOut}</p>
                  <p className="text-gray-600">User ID: {booking.userId}</p>
                  <p className="text-gray-600">Status: {booking.status}</p>
                </li>
              ))
            ) : (
              <p className="text-gray-600">No bookings available</p>
            )}
          </ul>
        </div>
  
        {/* Form Section */}
        <div className="mt-6">
          <Form newBookings={newBookings} handleChange={handleChange} handleSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}

export default FormData;
