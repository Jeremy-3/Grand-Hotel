import { useEffect, useState } from "react";

const Rooms = () => {
  const [hotel, setHotel] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/rooms")
      .then((res) => res.json())
      .then((data) => setHotel(data))
      .catch((error) => console.error("Error fetching rooms:", error));
  }, []);

  return (
    <div className="p-4">
      <div className="text-center mt-9">
        <h1 className="inline-block border-2 border-solid border-black  px-2 ">
          III
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
  );
};

export default Rooms;
