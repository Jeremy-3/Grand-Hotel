import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slideshow from "./Slideshow";

const Rooms = () => {
  const [hotel, setHotel] = useState([]);

  useEffect(() => {
    fetch("https://phase2-roomdb.vercel.app/rooms")
      .then((res) => res.json())
      .then((data) => setHotel(data))
      .catch((error) => console.error("Error fetching rooms:", error));
  }, []);

  const images = [
    "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1462539405390-d0bdb635c7d1?q=80&w=1520&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
          <Link to="/">Home</Link>
        </button>
        <div className="text-center mt-9">
          <h1 className="inline-block border-2 border-solid border-black  px-2 ">
            I
          </h1>
        </div>
        <h2 className="text-center text-5xl mt-24">Rooms</h2>
        <ul className="space-y-8">
          {hotel.map((data) => (
            <li
              key={data.id}
              className="flex flex-col lg:flex-row items-center lg:items-start mt-20"
            >
              <img
                src={data.image}
                alt={data.name}
                className="w-full lg:w-1/2 object-cover transition-transform duration-300 transform hover:scale-110 h-[500px] "
              />
              <div className="mt-4 lg:mt-0 lg:ml-8 text-center lg:text-left">
                <h2 className="text-xl font-semibold">{data.name}</h2>
                <p className="text-gray-600">{data.description}</p>
                <div className="flex flex-col">
                  <h2 className="font-semibold mt-3">Features</h2>
                  <ul className="list-disc list-inside mt-2">
                    {data.features.map((feature, index) => (
                      <li key={index} className="text-gray-700">
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="text-lg font-bold mt-2">Price: Ksh{data.price}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Rooms;
