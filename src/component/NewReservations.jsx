import React, { useState } from "react";

const NewReservations = ({ fetchReservations }) => {
  const [formData, setFormData] = useState({
    check_in_date: "",
    check_out_date: "",
    total_price: 0,
    guest_id: "",
    room_id: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedCheckInDate = new Date(formData.check_in_date).toISOString().slice(0, 19).replace('T', ' ');
    const formattedCheckOutDate = new Date(formData.check_out_date).toISOString().slice(0, 19).replace('T', ' ');

    const dataToSubmit = {
        ...formData,
        check_in_date: formattedCheckInDate,
        check_out_date: formattedCheckOutDate,
        total_price: parseInt(formData.total_price, 10), 
        guest_id: parseInt(formData.guest_id, 10),
        room_id: parseInt(formData.room_id, 10), 
      };

    console.log("Formatted form data:", dataToSubmit);

    try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/reservations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(dataToSubmit),
        });

        if (!response.ok) {
            throw new Error("Failed to submit form");
        }

        // Reset form data
        setFormData({
            check_in_date: "",
            check_out_date: "",
            total_price: 0,
            guest_id: "",
            room_id: "",
        });

        // Refresh reservations
        fetchReservations();
    } catch (error) {
        console.error("Error submitting form:", error);
    }
};


  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-100 p-2 rounded shadow-md mb-4 max-w-sm mx-auto"
    >
      <h3 className="text-lg font-semibold mb-2">Create Reservation</h3>
      <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
      <input
        type="datetime-local"
        name="check_in_date"
        value={formData.check_in_date}
        onChange={handleChange}
        required
        className="block w-full p-2 border border-gray-300 rounded mb-2"
      />
      <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
      <input
        type="datetime-local"
        name="check_out_date"
        value={formData.check_out_date}
        onChange={handleChange}
        required
        className="block w-full p-2 border border-gray-300 rounded mb-2"
      />
      <label className="block text-sm font-medium text-gray-700 mb-1">Total Price</label>
      <input
        type="number"
        name="total_price"
        value={formData.total_price}
        onChange={handleChange}
        required
        className="block w-full p-2 border border-gray-300 rounded mb-2"
      />
      <label className="block text-sm font-medium text-gray-700 mb-1">Guest ID</label>
      <input
        type="number"
        name="guest_id"
        value={formData.guest_id}
        onChange={handleChange}
        required
        className="block w-full p-2 border border-gray-300 rounded mb-2"
      />
      <label className="block text-sm font-medium text-gray-700 mb-1">Room ID</label>
      <input
        type="number"
        name="room_id"
        value={formData.room_id}
        onChange={handleChange}
        required
        className="block w-full p-2 border border-gray-300 rounded mb-2"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
      >
        Create Reservation
      </button>
    </form>
  );
};

export default NewReservations;
