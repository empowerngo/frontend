/* eslint-disable no-unused-vars */
import React from "react";
import bgImg from "../assets/bgImg1.png";
import logo from "../assets/Logo.png";

function LeftSide() {
  return (
    <div
      className="hidden md:flex md:w-[30%] flex-col justify-center items-center p-8 bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className="w-32 h-32 bg-white rounded-full mb-4 flex items-center justify-center">
        <img src={logo} alt="Logo" className="w-24 h-24 object-contain" />
      </div>
      <h1 className="text-white text-5xl font-bold mb-2">EmpowerNGO</h1>
      <p className="text-white text-center text-lg">
        Tech-powered Transformation for NGOs
      </p>
    </div>
  );
}

export default LeftSide;
