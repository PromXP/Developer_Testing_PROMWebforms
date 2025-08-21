"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import Image from "next/image";

import { API_URL } from "../libs/global";

import { Poppins } from "next/font/google";

import Human from "@/app/assets/student.png";
import Flower from "@/app/assets/flower.png";
import Qicon from "@/app/assets/questionnaire.png";
import Qimage from "@/app/assets/qimage.png";
import Leftleg from "@/app/assets/leftleg.png";
import Rightleg from "@/app/assets/rightleg.jpeg";

import Login from "@/app/Login/page";

import "@/app/globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

const page = ({ isOpenrating, onClose, selectedLegrating, selectedPeriod }) => {
  console.log("Selected Leg:", selectedLegrating + " / " + selectedPeriod);

  const [period, setPeriod] = useState("");
  const [surgeryRating, setSurgeryRating] = useState(0);
  const [recommendationRating, setRecommendationRating] = useState(0);
  const [response, setResponse] = useState(null);

  const [showAlert, setshowAlert] = useState(false);
  const [alermessage, setAlertMessage] = useState("");

  const showWarning = (message) => {
    setAlertMessage(message);
    setshowAlert(true);
    setTimeout(() => setshowAlert(false), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPeriod) {
      showWarning("Period Not found");
      return;
    }
    if (!surgeryRating || surgeryRating < 1 || surgeryRating > 10) {
      showWarning("Please select a valid surgery rating (1-10)");
      return;
    }
    if (
      !recommendationRating ||
      recommendationRating < 1 ||
      recommendationRating > 10
    ) {
      showWarning("Please select a valid recommendation rating (1-10)");
      return;
    }

    const payload = {
      "selectedLegrating": selectedLegrating,
      "selectedPeriod": selectedPeriod,
      "surgery_rating": surgeryRating,
      "recommendation_rating": recommendationRating,
    };

    try {
      const res = await axios.patch(
        API_URL + `patients/${sessionStorage.getItem("uhid")}/feedback`,
        payload
      );
      setResponse(res.data); // 👈 same as your login example
      window.location.reload();
    } catch (err) {
      console.error("Error submitting feedback:", err);
      showWarning(err.response?.data?.detail || "Failed to add feedback");
    }
  };

  const StarSelector = ({ value, onChange }) => {
    const [hover, setHover] = useState(null);

    return (
      <div className="flex justify-between">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((rating) => (
          <button
            key={rating}
            type="button"
            className="flex flex-col items-center cursor-pointer"
            onClick={() => onChange(rating)}
            onMouseEnter={() => setHover(rating)}
            onMouseLeave={() => setHover(null)}
          >
            <span
              className={
                rating <= (hover || value)
                  ? "text-yellow-400 text-2xl"
                  : "text-gray-400 text-2xl"
              }
            >
              ★
            </span>
            <span className="text-xs text-black mt-1">{rating}</span>
          </button>
        ))}
      </div>
    );
  };

  if (!isOpenrating) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.7)", // white with 50% opacity
      }}
    >
      <div
        className={` ${poppins.className} bg-white rounded-2xl p-6 w-[90%] max-w-lg shadow-xl flex flex-col gap-5`}
      >
        <h2 className="text-2xl font-semibold text-center text-black">
          Kindly Rate Your Experience
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4">
          <p className={`text-black font-medium text-base`}>
            1. How much rating you give for the surgery and outcome
          </p>
          <StarSelector value={surgeryRating} onChange={setSurgeryRating} />
          <p className={`text-black font-medium text-base pt-10`}>
            2. How much you recommend this surgery to your friends and relatives
            who are suffering from chronic knee pain
          </p>
          <StarSelector
            value={recommendationRating}
            onChange={setRecommendationRating}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 mt-4 rounded hover:bg-blue-700 cursor-pointer"
          >
            Submit Feedback
          </button>

        
        </form>
      </div>

      {showAlert && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-3 rounded-lg shadow-lg animate-fade-in-out">
            {alermessage}
          </div>
        </div>
      )}
    </div>
  );
};

export default page;
