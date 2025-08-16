"use client";
import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { API_URL } from "../libs/global";

import Image from "next/image";

import { Poppins } from "next/font/google";

import Human from "@/app/assets/student.png";
import Flower from "@/app/assets/flower.png";
import Closeicon from "@/app/assets/closeicon.png";
import LoginBg from "@/app/assets/login.jpg";

import "@/app/globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

const page = ({handleshowforgot}) => {
  const useWindowSize = () => {
    const [size, setSize] = useState({
      width: 0,
      height: 0,
    });

    useEffect(() => {
      const updateSize = () => {
        setSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      updateSize(); // set initial size
      window.addEventListener("resize", updateSize);
      return () => window.removeEventListener("resize", updateSize);
    }, []);

    return size;
  };

  const { width, height } = useWindowSize();

  const [resetEmail, setResetEmail] = useState("");
  const [forgotuserUHID, setforgotuserUHID] = useState("");

  const handleForgotPassword = async () => {
    if (!forgotuserUHID) {
      handleshowwarning("Please enter your UHID");

      return;
    }
    if (!resetEmail) {
      handleshowwarning("Please enter your registered Email");

      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}request_password_reset?uhid=${encodeURIComponent(
          forgotuserUHID
        )}&email=${encodeURIComponent(resetEmail)}`
      );

      const data = response.data;

      if (response.ok) {
        handleshowwarning("Reset link sent to your email.");
      }
      // else {
      //   showWarning(data.message || "Failed to send reset link.");
      // }
    } catch (error) {
      console.log("Error reset", error);
      handleshowwarning("Entered credentials are incorrect Check your credentials");
    }


  };

  return (
    <form
      key="forgot-form"
      onSubmit={(e) => {
        e.preventDefault(); // Prevent form reload
        handleForgotPassword(); // Call your login function
      }}
      className="flex flex-col gap-5"
    >
      {/* Common Heading */}
      <div
        className={`w-full flex gap-4 justify-start items-center ${
          width < 530 ? "flex-col justify-center items-center" : "flex-row"
        }`}
      >
        <p className="font-bold text-5 text-black">ENTER UHID</p>
      </div>

      {/* Common Input */}
      <div className="w-full flex flex-col gap-2">
        <input
          placeholder="UHID"
          rows={3}
          className="w-full text-black px-4 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ backgroundColor: "rgba(71, 84, 103, 0.1)" }}
          value={forgotuserUHID}
          onChange={(e) => setforgotuserUHID(e.target.value)}
        />
      </div>
      <div className="w-full flex flex-col gap-3">
        <p className="text-black font-semibold">Enter your registered Email</p>
        <input
          type="text"
          placeholder="Registered Email"
          className="w-full text-black px-4 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ backgroundColor: "rgba(71, 84, 103, 0.1)" }}
          value={resetEmail}
          onChange={(e) => setResetEmail(e.target.value)}
        />

        <div className="flex flex-row justify-center items-center gap-4">
          <button
            type="submit"
            className="bg-[#005585] text-white px-4 py-2 rounded-md mt-2 cursor-pointer"
            // onClick={handleForgotPassword}
          >
            Send Reset Link
          </button>
          <button
            type="button"
            className="text-[#005585] underline text-sm cursor-pointer"
            onClick={() => {
              handleshowforgot();
              setResetEmail("");
              setforgotuserUHID("");
            }}
          >
            Back to Login
          </button>
        </div>
      </div>
    </form>
  );
};

export default page;
