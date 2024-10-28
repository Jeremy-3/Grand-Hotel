import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="about-container min-h-screen bg-cover bg-center text-gray-800 py-20 px-6 flex items-center justify-center">
      <div className="max-w-4xl mx-auto bg-white/80 rounded-lg shadow-lg p-10 backdrop-blur-md">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
          About Grand Hotel
        </h1>
        <p className="text-lg leading-relaxed text-gray-700">
          Welcome to the Grand Hotel, where elegance meets exceptional service.
          Located in the heart of the city, we offer luxurious rooms designed to
          cater to both business and leisure travelers. At Grand Hotel, we
          prioritize your comfort with amenities such as gourmet dining, serene
          wellness facilities, and modern event spaces. Join us and experience
          unparalleled hospitality tailored to your needs.
        </p>
      </div>
    </div>
  );
};

export default About;
