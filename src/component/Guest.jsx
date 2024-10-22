import React, { useEffect, useState } from "react";
import "tailwindcss/tailwind.css";

const Guest = () => {
  const [guests, setGuests] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("/api/guests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setGuests(data);
    } catch (error) {
      console.error("Error fetching guests:", error);
      setGuests([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const method = editId ? "PATCH" : "POST";
      const url = editId ? `/api/guests/${editId}` : "/api/guests";
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, phone }),
      });

      if (!response.ok) throw new Error("Network response was not ok");
      const newGuest = await response.json();
      if (editId) {
        setGuests((prev) =>
          prev.map((guest) => (guest.id === editId ? newGuest : guest))
        );
      } else {
        setGuests((prev) => [...prev, newGuest]);
      }
      resetForm();
    } catch (error) {
      console.error("Error creating/updating guest:", error);
    }
  };

  const handleEdit = (guest) => {
    setName(guest.name);
    setEmail(guest.email);
    setPhone(guest.phone);
    setEditId(guest.id);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`/api/guests/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Network response was not ok");
      setGuests((prev) => prev.filter((guest) => guest.id !== id));
    } catch (error) {
      console.error("Error deleting guest:", error);
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setEditId(null);
  };

  return (
    <div
      className="container mx-auto p-6 bg-white bg-opacity-90 rounded-lg shadow-lg"
      style={{
        backgroundImage: `url('https://media.istockphoto.com/id/1248298343/photo/3d-rendering-of-a-luxury-restaurant-interior-at-night.webp?a=1&b=1&s=612x612&w=0&k=20&c=m4HAT3kOdvfvj7V1odHpY9GwHTgmQGlVVUrdV-0FrXw=')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Guests</h2>
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone"
          required
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md w-full hover:bg-blue-600 transition duration-200"
        >
          {editId ? "Update Guest" : "Add Guest"}
        </button>
      </form>
      <h3 className="text-xl font-semibold mb-2 text-blue-600">Existing Guests</h3>
      <ul className="space-y-4">
        {guests.length > 0 ? (
          guests.map((guest) => (
            <li
              key={guest.id}
              className="flex justify-between items-center bg-white p-4 border border-gray-300 rounded-md shadow hover:shadow-md transition duration-200"
            >
              <div>
                <strong>Name:</strong> {guest.name} |{" "}
                <strong>Email:</strong> {guest.email} |{" "}
                <strong>Phone:</strong> {guest.phone}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(guest)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(guest.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-200"
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <li className="flex justify-center items-center bg-white p-4 border border-gray-300 rounded-md shadow">
            <p>No guests found.</p>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Guest;
