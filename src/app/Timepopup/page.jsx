"use client";

import React, { useState, useEffect, use } from "react";


import "@/app/globals.css";


const page = ({ onProceed }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50"
    style={{
        backgroundColor: "rgba(0, 0, 0, 0.7)", // white with 50% opacity
      }}>
      <div className="bg-white rounded-2xl p-8 w-[90%] max-w-md flex flex-col items-center gap-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Please Note
        </h2>
        <p className="text-gray-600 text-center text-base">
          This questionnaire takes approximately <span className="font-semibold">15 minutes</span> to complete.
        </p>
        <button
          onClick={onProceed}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-full transition duration-300 cursor-pointer"
        >
          Proceed
        </button>
      </div>
    </div>
  )
}

export default page