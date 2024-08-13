import React from "react";

const Cuisines = () => {
  return (
    <div>
      <div className="text-center mt-9">
        <h1 className="inline-block border-2 border-solid border-black  px-2 ">
          II
        </h1>
      </div>
      <h2 className="text-5xl text-center mt-8">
        Exceptional Cuisines in beautiful spaces
      </h2>

      <div className="flex flex-col  md:flex-row justify-center">
        <div className="flex justify-center mb-10 ">
          <img
            src="src/component/homeimages/gastro1.jpg"
            alt="gastro table setup"
            className="w-[400px] mt-36 rounded md:w-[2500px] md:h-[500px] md:ml-64  lg:w-[1800px] lg:h-[500px] lg:ml-80 transition-transform duration-300 transform hover:scale-110 hover:rotate-3"
          />
        </div>
        <p className="text-center lg:mt-64  lg:ml-64 lg:mr-36 text-xl md:mt-56 md:ml-56 md:mr-24">
          Culinary art is an important part of the unforgettable experience
          prepared for each of you. The world full taste is an endless
          inspiration for our chef and his team. Traditional recipes. Quality
          seasonal products. See. To feel. Enjoy it. And let yourself be
          pampered. This is gastronomy at Wellness & Spa Grand Hotel.
        </p>
      </div>
    </div>
  );
};

export default Cuisines;
