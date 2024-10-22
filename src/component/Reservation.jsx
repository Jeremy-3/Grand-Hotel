import React, { useEffect, useState } from "react";
import Prompt from "./Prompt";
import NewReservations from "./NewReservations";

const Reservation = () => {
  const [reservations, setReservations] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchReservations();
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/reservations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      console.log(data);
      setReservations(data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      setReservations([]);
    }
  };

  const handleDelete = async (reservationId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Network response was not ok");

      // Refresh the list of reservations after deletion
      fetchReservations();
    } catch (error) {
      console.error("Error deleting reservation:", error);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://plus.unsplash.com/premium_photo-1663040384355-563a967f5938?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aG90ZWwlMjBsb2JieXxlbnwwfHwwfHx8MA%3D%3D')",
      }}
    >
      <div className="container mx-auto p-4 bg-white bg-opacity-80 rounded shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Reservations</h2>
        <Prompt isAuthenticated={isLoggedIn} />
        {isLoggedIn ? (
          <>
            <NewReservations fetchReservations={fetchReservations} />
            <h3 className="text-lg font-semibold mb-2">
              Existing Reservations
            </h3>
            <ul className="space-y-2">
              {reservations.length > 0 ? (
                reservations.map((reservation) => (
                  <li
                    key={reservation.id}
                    className="flex justify-between items-center bg-white p-4 border border-gray-300 rounded shadow"
                  >
                    <div>
                      <div>
                        <strong>Check-in:</strong> {reservation.check_in_date} -{" "}
                        <strong>Check-out:</strong> {reservation.check_out_date}
                      </div>
                      <div>
                        <strong>Total Price:</strong> {reservation.total_price}{" "}
                        | <strong>Guest ID:</strong> {reservation.guest_id} |{" "}
                        <strong>Room ID:</strong> {reservation.room_id}
                      </div>
                      <div>
                        <strong>Guest Name:</strong> {reservation.guests.name} |{" "}
                        <strong>Room Type:</strong>{" "}
                        {reservation.rooms.room_type}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDelete(reservation.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <li className="flex justify-center items-center bg-white p-4 border border-gray-300 rounded shadow">
                  <p>No reservations found.</p>
                </li>
              )}
            </ul>
          </>
        ) : (
          <p className="text-center">
            Please log in to view your reservations.
          </p>
        )}
      </div>
    </div>
  );
};

export default Reservation;
