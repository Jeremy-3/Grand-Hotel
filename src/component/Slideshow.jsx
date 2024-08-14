import { useEffect, useState } from "react";

const Slideshow = ({ images, interval = 3000, title, paragraph }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    // Clears the interval when the component unmounts
    return () => clearInterval(slideInterval);
  }, [images.length, interval]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <img
        src={images[currentIndex]}
        alt={`Slide ${currentIndex + 1}`}
        className="w-full h-full object-cover"
      />

      {title && (
        <h1 className="absolute inset-0 flex items-center justify-center text-white text-6xl md:text-6xl lg:text-8xl font-bold">
          {title}
        </h1>
      )}
      {paragraph && (
        <p className="text-lg md:text-xl lg:text-2xl text-blue-800">
          {paragraph}
        </p>
      )}
    </div>
  );
};

export default Slideshow;
