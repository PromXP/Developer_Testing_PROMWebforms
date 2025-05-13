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

const page = ({ isOpen, onClose, onSubmit }) => {
  const [filledBy, setFilledBy] = useState("Self");
  const [whoFilled, setWhoFilled] = useState("");
  const [otherPain, setOtherPain] = useState("No");
  const [painDetails, setPainDetails] = useState("");

  const handleSubmit = () => {
    onSubmit({
      filledBy,
      whoFilled: filledBy === "Other" ? whoFilled : "",
      otherPain,
      painDetails: otherPain === "Yes" ? painDetails : "",
    });
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.7)", // white with 50% opacity
      }}
    >
      <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl flex flex-col gap-5">
        <h2 className="text-2xl font-semibold text-center text-black">
          Fill this to start questionnaire
        </h2>

        {/* Question 1 */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">
            Is the questionnaire filled by you or someone else?
          </label>
          <select
            value={filledBy}
            onChange={(e) => setFilledBy(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 text-black"
          >
            <option value="Self">Self</option>
            <option value="Other">Someone Else</option>
          </select>

          {filledBy === "Other" && (
            <input
              type="text"
              placeholder="Who filled it?"
              value={whoFilled}
              onChange={(e) => setWhoFilled(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 mt-2 text-black"
            />
          )}
        </div>

        {/* Question 2 */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">
            Do you feel any other pain in the body?
          </label>
          <select
            value={otherPain}
            onChange={(e) => setOtherPain(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 text-black"
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>

          {otherPain === "Yes" && (
            <input
              type="text"
              placeholder="Please describe the pain"
              value={painDetails}
              onChange={(e) => setPainDetails(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 mt-2 text-black"
            />
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default page;
