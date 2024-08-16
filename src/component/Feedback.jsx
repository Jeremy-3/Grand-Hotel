import React, { useState } from 'react';
import Swal from 'sweetalert2';

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleRating = (rate) => {
    setRating(rate);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle feedback submission logic here
    console.log("Rating:", rating);
    console.log("Feedback:", feedback);

    // Show SweetAlert2 alert
    Swal.fire({
      title: "Thank you!",
      text: "Your feedback has been submitted successfully.",
      icon: "success",
      confirmButtonText: "Okay"
    }).then(() => {
      // Reset form after the alert is closed
      setRating(0);
      setFeedback('');
    });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">We value your feedback!</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rating">
            Rate Us:
          </label>
          <div className="flex justify-center mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                className={`text-3xl ${star <= rating ? 'text-yellow-500' : 'text-gray-300'} hover:text-yellow-400`}
                onClick={() => handleRating(star)}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="feedback">
            Your Feedback:
          </label>
          <textarea
            id="feedback"
            className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            rows="4"
            placeholder="Write your feedback here..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline hover:bg-blue-600 transition duration-300 ease-in-out"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Feedback;
