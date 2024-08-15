import React from "react";
import Slideshow from "./Slideshow";
import Cuisines from "./Cuisines";
import "./Home.css";
//import Rooms from "./Rooms";
import { Link } from "react-router-dom";

const Home = () => {
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
        title="GRAND HOTEL"
        paragraph="Wine & Dine"
      />

      <div className="text-center mt-9">
        <h1 className="inline-block border-2 border-solid border-black  px-2 ">
          I
        </h1>
      </div>
      <div>
        <h2 className="mt-14 text-center text-3xl text-bold ml-40 mr-40">
          Welcome to GRAND HOTEL, where comfort meets elegance in the heart of
          NAIROBI. Whether you're here for business, leisure, or a special
          occasion, our exceptional service and modern amenities ensure a
          memorable stay. Explore our luxurious rooms, savor gourmet dining, and
          relax in our serene surroundings. Your perfect escape starts here.
        </h2>
      </div>
      <div className="flex justify-center">
        <button className="mt-5 bg-slate-600 py-3 px-8 rounded hover:bg-amber-900">
          <Link to="/rooms">Rooms</Link>
        </button>
      </div>
      <div className="flex justify-center mt-8 overflow-hidden">
        <img
          src="/homeimages/fav2.jpg"
          alt=""
          className=" w-[900px] h-[700px]  object-cover transition-opacity duration-300 hover:opacity-30"
        />
      </div>
      <Cuisines />
    </div>
  );
};

export default Home;
