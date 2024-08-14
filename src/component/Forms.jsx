import React from "react";

function Form({ newBookings, handleSubmit, handleChange }) {
  console.log(newBookings);

  return (
    <>
      <form
        className="max-w-lg mx-auto my-10 p-6 bg-slate-500 rounded-lg shadow-lg"
        onSubmit={handleSubmit}
      >
        <div>
          <label htmlFor="roomId">Room ID:</label>
          <input
            type="text"
            name="roomId"
            value={newBookings.roomId}
            onChange={handleChange}
            className="block text-sm font-medium text-gray-700"
            required
          />
        </div>

        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="userId"
          >
            User ID:
          </label>
          <input
            type="text"
            name="userId"
            value={newBookings.userId}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="checkIn"
          >
            Check-In Date:
          </label>
          <input
            type="date"
            name="checkIn"
            value={newBookings.checkIn}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="checkOut"
          >
            Check-Out Date:
          </label>
          <input
            type="date"
            name="checkOut"
            value={newBookings.checkOut}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="status"
          >
            Status:
          </label>
          <select
            name="status"
            value={newBookings.status}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <button
          className="w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
          type="submit"
        >
          Add Booking
        </button>
      </form>
    </>
  );
}

export default Form;