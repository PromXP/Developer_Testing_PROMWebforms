"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { API_URL } from "./libs/global";

import Image from "next/image";

import { Poppins } from "next/font/google";

import Human from "@/app/assets/student.png";
import Flower from "@/app/assets/flower.png";

import Login from "@/app/Login/page";
import Firstimepassreset from "@/app/Firsttimepass/page";

import "@/app/globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

export default function Home() {
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

  const [userData, setUserData] = useState(null);

  const today = new Date().toLocaleDateString("en-US", {
    month: "long", // "April"
    day: "2-digit", // "09"
    year: "numeric", // "2025"
  });

  // const data = [
  //   {
  //     status: "Completed",
  //     period: "Pre Operative",
  //     title: "OXFORD KNEE SCORE (OKS)",
  //     periodShort: "PRE OP",
  //     questions: 14,
  //     duration: "10 min",
  //   },
  //   {
  //     status: "Pending",
  //     period: "6 Weeks",
  //     title: "KNEE SOCIETY SCORE (KSS)",
  //     periodShort: "6 W",
  //     questions: 18,
  //     duration: "9 min",
  //   },
  //   {
  //     status: "Completed",
  //     period: "3 Months",
  //     title: "KNEE INJURY AND OSTEOARTHRITIS OUTCOME SCORE (KOOS)",
  //     periodShort: "3 M",
  //     questions: 15,
  //     duration: "12 min",
  //   },
  //   {
  //     status: "Pending",
  //     period: "6 Months",
  //     title: "FORGOTTEN JOINT SCORE (FJS)",
  //     periodShort: "6 M",
  //     questions: 12,
  //     duration: "8 min",
  //   },
  //   {
  //     status: "Completed",
  //     period: "1 Year",
  //     title: "SHORT FORM 12 (SF-12)",
  //     periodShort: "1 YR",
  //     questions: 12,
  //     duration: "10 min",
  //   },
  // ];

  const router = useRouter();

  const [transformedData, setTransformedData] = useState([]);

  const [isOpen, setIsOpen] = useState(true);

  const [passopen, setpassopen] = useState(false);


  const mapQuestionnaireData = (assignedList) => {
    return assignedList.map((item) => {
      const name = item.name.toLowerCase();
      let questions = 0;
      let duration = "";

      if (name.includes("oxford knee score")) {
        questions = 12;
        duration = "15 min";
      } else if (name.includes("short form - 12")) {
        questions = 12;
        duration = "15 min";
      } else if (name.includes("koos")) {
        questions = 7;
        duration = "12 min";
      } else if (name.includes("knee society score")) {
        questions = 8;
        duration = "12 min";
      } else if (name.includes("forgotten joint score")) {
        questions = 12;
        duration = "15 min";
      }

      return {
        status: item.completed === 1 ? "Completed" : "Pending",
        period: item.period,
        title: item.name,
        periodShort: item.period,
        questions: questions,
        duration: duration,
        assigned_date: item.assigned_date,
        deadline: item.deadline,
      };
    });
  };

  const handleUserData = (data) => {
    setUserData(data);
  };

  useEffect(() => {
    if (userData?.user?.questionnaire_assigned) {
      const mapped = mapQuestionnaireData(userData.user.questionnaire_assigned);
      setTransformedData(mapped);
    }
    console.log("Patient Data", userData);
  }, [userData]);

  useEffect(() => {
    const uhid = sessionStorage.getItem("uhid");
    const password = sessionStorage.getItem("password");

    if (password === "patient@123") {
      setpassopen(true);
    }
    // If userData already exists, don't fetch again
    if (userData && userData.user) return;

    

    if (uhid && password) {
      setIsOpen(false);
      const fetchUserData = async () => {
        try {
          const res = await axios.post(API_URL + "login", {
            identifier: uhid,
            password: password,
            role: "patient",
          });
          handleUserData(res.data); // this will trigger your other effect
        } catch (err) {
          console.error("Auto login failed:", err);
          sessionStorage.clear(); // remove bad data
        }
      };

      fetchUserData();
    }
  }, [userData]);

  const handlequestionnaireclick = (title, period) => {
    console.log("Questionnaire Data", transformedData); // log the mapped value here
    console.log("Selected Questionnaire:", title);
    console.log("Period:", period);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("questionnaire_title", title);
      sessionStorage.setItem("questionnaire_period", period);
      sessionStorage.setItem("uhid", userData.user.uhid);
      sessionStorage.setItem(
        "name",
        userData.user.first_name + " " + userData.user.last_name
      );
    }

    router.push("/Questionnaire");
  };




  return (
    <>
      <div
        className={`${poppins.className} w-screen  bg-white flex flex-col  ${
          width < 600 ? (isOpen ? "h-screen" : "h-full") : "h-screen p-4"
        }
 relative`}
      >
        <div
          className={`w-full  rounded-2xl bg-[linear-gradient(to_bottom_right,_#7075DB_0%,_#7075DB_40%,_#DFCFF7_100%)] flex ${
            width < 750
              ? "flex-col h-fit justify-center items-center gap-4 p-4"
              : "flex-row h-[30%] px-10"
          }`}
        >
          <div
            className={`w-1/2 h-full flex flex-col justify-center ${
              width < 750 ? "items-center" : ""
            }`}
          >
            <p className="font-normal text-base text-white">{today}</p>
            <div
              className={`flex flex-col ${width < 750 ? "items-center" : ""}`}
            >
              <div
                className={`w-full flex flex-col ${
                  width < 750 ? "items-center" : ""
                }`}
              >
                <p
                  className={`font-semibold text-[32px] text-white ${
                    width < 750 ? "text-center" : ""
                  }`}
                >
                  Welcome Back!
                </p>
                <p
                  className={`font-semibold text-[32px] text-white ${
                    width < 750 ? "text-center" : ""
                  }`}
                >
                  {userData?.user?.first_name +
                    " " +
                    userData?.user?.last_name || "User"}
                </p>
              </div>
              <p
                className={`font-normal text-base text-white ${
                  width < 750 ? "text-center" : ""
                }`}
              >
                A compelete questionnaire section
              </p>
            </div>
          </div>

          <div
            className={`w-1/2 h-full flex  ${
              width < 750 ? "justify-center" : "justify-end"
            }`}
          >
            <Image src={Human} alt="human" className="w-[300px] h-full" />
          </div>
        </div>

        <div
          className={`w-full ${
            width < 600 ? "h-full" : "overflow-x-auto  h-[70%] "
          }`}
        >
          <div
            className={`${
              width < 600 ? "flex-col mx-auto" : "flex-row"
            } flex gap-4 w-max`}
          >
            {transformedData.map((item, index) => (
              <div
                key={index}
                className={` h-[350px] bg-white rounded-2xl flex flex-col p-6 shadow-2xl gap-5 ${
                  item.status === "Pending"
                    ? "cursor-pointer"
                    : "cursor-default"
                } ${
                  width < 350
                    ? "w-full"
                    : width < 600
                    ? "w-[350px]"
                    : "w-[350px]"
                }`}
                onClick={() =>
                  item.status === "Pending" &&
                  handlequestionnaireclick(item.title, item.period)
                }
              >
                <div className="w-full h-[15%] flex justify-end items-center">
                  <p
                    className={`text-white font-normal text-base rounded-2xl px-3 py-1 ${
                      item.status === "Pending"
                        ? "bg-[#FF4C4C]"
                        : "bg-[#199855]"
                    }`}
                  >
                    {item.status}
                  </p>
                </div>
                <div className="w-full h-[50%] flex justify-start flex-col">
                  <p className="font-normal text-[16px] text-[#3B3B3B]">
                    Period: {item.period}
                  </p>
                  <p className="font-semibold text-[20px] text-[#1E1E1E]">
                    {item.title}
                  </p>
                </div>
                <div className="w-full h-[35%] flex items-center flex-row justify-start">
                  <div className="w-1/3 h-full flex flex-col items-center justify-between">
                    <p className="font-normal text-[15px] text-[#3C3C3C] text-center">
                      No. of Questions
                    </p>
                    <p className="font-semibold text-[16px] text-black text-center">
                      {item.questions}
                    </p>
                  </div>
                  <div className="w-1/3 h-full flex flex-col items-center justify-between">
                    <p className="font-normal text-[15px] text-[#3C3C3C] text-center">
                      Duration
                    </p>
                    <p className="font-semibold text-[16px] text-black text-center">
                      {item.duration}
                    </p>
                  </div>
                  <div className="w-1/3 h-full flex flex-col items-center justify-between">
                    <p className="font-normal text-[15px] text-[#3C3C3C] text-center">
                      Deadline
                    </p>
                    <p className="font-semibold text-[16px] text-black text-center">
                      {new Date(item.deadline).toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-4">
          <Image src={Flower} alt="flower" className="w-32 h-32" />
        </div>
      </div>
      <Login
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        userDatasend={handleUserData}
      />
      <Firstimepassreset
        passopen={passopen}
        onClose={() => setpassopen(false)}
      />
    </>
  );
}
