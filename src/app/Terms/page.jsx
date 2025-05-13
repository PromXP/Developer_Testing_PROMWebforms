"use client";
import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import Image from "next/image";

import { Poppins } from "next/font/google";

import { API_URL } from "../libs/global";

import "@/app/globals.css";

const page = ({ isTermsopen, isTermsclose }) => {
  const [accepted, setAccepted] = useState(false);

  const handleProceed = () => {
    if (accepted) {
      // Proceed to next step
      console.log("User accepted and proceeded!");
      isTermsclose();
    }
  };

  if (!isTermsopen) return null;

  return (
    <div
      className="fixed inset-0 z-40 "
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.7)", // white with 50% opacity
      }}
    >
      <div className="flex flex-col items-center p-6  w-fit mx-auto border rounded-xl shadow-md bg-white">
        <h2 className="text-2xl font-bold mb-4 text-black">Terms and Conditions</h2>

        <div className="h-full border p-4 rounded-md mb-4 bg-gray-100 text-sm text-gray-700">
          <p>
            Welcome to our application. Please read these Terms and Conditions
            carefully before proceeding.
            <br />
            <br />
            - You agree to use the application responsibly.
            <br />
            - Your data will be processed in accordance with our Privacy Policy.
            <br />
            - Unauthorized use may result in termination.
            <br />
            - We are not responsible for any third-party content.
            <br />
            <br />
            By checking the box below, you accept these Terms and Conditions.
          </p>
        </div>

        <div className="flex items-center mb-4">
          <input
            id="accept"
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mr-2 cursor-pointer"
          />
          <label htmlFor="accept" className="text-sm text-gray-800">
            I agree to the Terms and Conditions
          </label>
        </div>

        <div className="flex space-x-4">
        
          <button
            onClick={handleProceed}
            disabled={!accepted}
            className={`px-4 py-2 rounded-md text-sm ${
              accepted
                ? "bg-green-500 text-white hover:bg-green-600 cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default page;
