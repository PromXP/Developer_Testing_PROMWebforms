"use client";
import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import {
  LineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
} from "recharts";

import { API_URL } from "./libs/global";

import Image from "next/image";

import { Poppins } from "next/font/google";

import Human from "@/app/assets/student.png";
import Flower from "@/app/assets/flower.png";
import Logout from "@/app/assets/logout.png";
import CloseIcon from "@/app/assets/closeicon.png";

import Login from "@/app/Login/page";
import Firstimepassreset from "@/app/Firsttimepass/page";
import Terms from "@/app/Terms/page";

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

  const [userinfo, setuserinfo] = useState([]);

  const { width, height } = useWindowSize();

  const [userData, setUserData] = useState(null);

  const [selectedLeg, setSelectedLeg] = useState("left");

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
  const [termsopen, setTermsopen] = useState(false);

  const mapQuestionnaireData = (assignedList, leg) => {
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
        leg: leg, // <-- Added leg here
      };
    });
  };

  const isQuestionnaireVisible = (q, today) => {
    const deadlineDate = new Date(q.deadline);
    const surgeryDate = q.surgery_date ? new Date(q.surgery_date) : null;
    const now = today;

    // Example: Pre-op if period contains "PRE OP" (adjust as needed)
    if (q.period && q.period.toUpperCase().includes("PRE OP")) {
      // Show only if today is before surgery date
      return surgeryDate ? now < surgeryDate : true;
    } else {
      // Post-op: show if today is on/before deadline and not more than 14 days after deadline
      const daysAfterDeadline = (now - deadlineDate) / (1000 * 60 * 60 * 24);
      return (
        now >= deadlineDate ||
        (daysAfterDeadline > 0 && daysAfterDeadline <= 14)
      );
    }
  };

useEffect(() => {
  const tempData = [];
  const today = new Date();

  const processSide = (assignedList, surgeryDateStr, sideLabel) => {
    const surgeryDate = surgeryDateStr;
    const enriched = assignedList.map((q) => ({
      ...q,
      surgery_date: surgeryDate,
    }));

    const live = [];
    const expiredPending = [];

    enriched.forEach((q) => {
      if (isQuestionnaireVisible(q, today)) {
        live.push(q);
      } else {
        const deadline = new Date(q.deadline);
        const daysAfterDeadline = (today - deadline) / (1000 * 60 * 60 * 24);
        if (q.completed === 0 && today > deadline && daysAfterDeadline > 14) {
          expiredPending.push(q);
        }
      }
    });
// 1. Sort by deadline descending
expiredPending.sort((a, b) => new Date(b.deadline) - new Date(a.deadline));

// 2. Get latest deadline date
const latestDeadline = expiredPending.length > 0 ? expiredPending[0].deadline : null;

// 3. Filter all expired with the latest deadline
const latestExpired = latestDeadline
  ? expiredPending.filter(q => q.deadline === latestDeadline)
  : [];

const combined = [...live, ...latestExpired];


    // Attach side and sort final combined data by deadline
    return mapQuestionnaireData(combined, sideLabel).sort(
      (a, b) => new Date(a.deadline) - new Date(b.deadline)
    );
  };

  if (userData?.user?.questionnaire_assigned_left) {
    const leftResult = processSide(
      userData.user.questionnaire_assigned_left,
      userData?.user?.post_surgery_details_left?.date_of_surgery,
      "Left"
    );
    tempData.push(...leftResult);
  }

  if (userData?.user?.questionnaire_assigned_right) {
    const rightResult = processSide(
      userData.user.questionnaire_assigned_right,
      userData?.user?.post_surgery_details_right?.date_of_surgery,
      "Right"
    );
    tempData.push(...rightResult);
  }

  setTransformedData(tempData);
}, [userData]);


  const handleUserData = (data) => {
    setUserData(data);
    setpatientdata(data.user);
  };

  const [patientdata, setpatientdata] = useState();

  useEffect(() => {
    const uhid = sessionStorage.getItem("uhid");
    const password = sessionStorage.getItem("password");

    const userin = sessionStorage.getItem("userinfo");
    if (userin) {
      const parsedUser = JSON.parse(userin); // Parse the string to an actual object
      console.log("User Info", parsedUser);
    } else {
      console.log("No user info found in sessionStorage.");
    }

    if (password === "patient@123") {
      setTermsopen(true);
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

  const handlequestionnaireclick = (title, period, leg) => {
    // console.log("Questionnaire Data", transformedData); // log the mapped value here
    // console.log("Selected Questionnaire:", title);
    // console.log("Period:", period);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("questionnaire_title", title);
      sessionStorage.setItem("questionnaire_period", period);
      sessionStorage.setItem("questionnaire_leg", leg);
      sessionStorage.setItem("uhid", userData.user.uhid);
      sessionStorage.setItem(
        "name",
        userData.user.first_name + " " + userData.user.last_name
      );
    }

    router.push("/Questionnaire");
  };

  const data = [
    { value: 10 },
    { value: 30 },
    { value: 20 },
    { value: 50 },
    { value: 40 },
  ];

  const normalizePeriod = (period) =>
    period.trim().toUpperCase().replace(/\s+/g, "");

  const getScoreByPeriodAndType = (scores, period, type) => {
    const match = scores.find(
      (s) =>
        normalizePeriod(s.period) === normalizePeriod(period) &&
        s.name.toLowerCase().includes(type.toLowerCase())
    );
    return match ? match.score[0] : null;
  };

  const generateChartData = (patient) => {
    const scores =
      selectedLeg === "left"
        ? patient?.questionnaire_scores_left || []
        : patient?.questionnaire_scores_right || [];

    const periodMap = {
      "-3": "PRE OP",
      "3W": "3W", // 👈 Add this
      SURGERY: "SURGERY",
      "+42": "6W",
      "+90": "3M",
      "+180": "6M",
      "+365": "1Y",
      "+730": "2Y",
    };

    const timeOrder = {
      "-3": -3,
      "3W": 21, // 👈 Approximate 3 weeks in days
      SURGERY: 10,
      "+42": 42,
      "+90": 90,
      "+180": 180,
      "+365": 365,
      "+730": 730,
    };

    // Check if a period exists in the questionnaire_scores
    const hasPeriodData = (periodKey) => {
      return scores.some(
        (s) =>
          normalizePeriod(s.period) === normalizePeriod(periodMap[periodKey])
      );
    };

    // Always include surgery, include others only if data exists
    const periods = Object.keys(periodMap).filter(
      (key) => key === "SURGERY" || hasPeriodData(key)
    );

    const chartData = periods.map((label) => {
      const periodKey = periodMap[label];

      return {
        name: periodKey,
        oks:
          label === "SURGERY"
            ? undefined
            : getScoreByPeriodAndType(scores, periodKey, "Oxford Knee Score"),
        sf12:
          label === "SURGERY"
            ? undefined
            : getScoreByPeriodAndType(scores, periodKey, "SF-12"),
        koos:
          label === "SURGERY"
            ? undefined
            : getScoreByPeriodAndType(scores, periodKey, "KOOS"),
        kss:
          label === "SURGERY"
            ? undefined
            : getScoreByPeriodAndType(scores, periodKey, "KSS"),
        fjs:
          label === "SURGERY"
            ? undefined
            : getScoreByPeriodAndType(scores, periodKey, "FJS"),
        _order: timeOrder[label],
      };
    });

    return chartData
      .sort((a, b) => a._order - b._order)
      .map(({ _order, ...rest }) => rest);
  };

  const graphdata = patientdata ? generateChartData(patientdata) : [];

  const [performshow, setPerformshow] = useState(false);

  const handlePerform = () => {
    setPerformshow(!performshow);
  };

  const [filterStatus, setFilterStatus] = useState("Pending");

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

              <div className={`w-full flex flex-row gap-8 items-center`}>
                <p
                  className={`font-normal text-base text-white ${
                    width < 750 ? "text-center" : ""
                  }`}
                >
                  A complete questionnaire section
                </p>

                <Image
                  src={Logout}
                  alt="logout"
                  className="w-8 h-8 cursor-pointer"
                  onClick={() => {
                    sessionStorage.clear();
                    setIsOpen(true);
                  }}
                />
              </div>
            </div>
          </div>

          <div
            className={`w-1/2 h-full flex  ${
              width < 750 ? "justify-center" : "justify-between items-center"
            }`}
          >
            <div className="flex flex-col items-center gap-4">
              <button
                className="bg-[#005585] w-fit text-white px-6 py-2 rounded-full shadow-md hover:bg-[#004466] transition duration-300 cursor-pointer"
                onClick={handlePerform}
              >
                Your Performance
              </button>

              <div className="flex flex-row gap-4">
                <button
                  className={`${
                    filterStatus === "Pending" ? "bg-[#FF4C4C]" : "bg-gray-300"
                  } text-white text-sm px-4 py-1 rounded-full shadow-md transition duration-300 cursor-pointer`}
                  onClick={() => setFilterStatus("Pending")}
                >
                  PENDING
                </button>

                <button
                  className={`${
                    filterStatus === "Completed"
                      ? "bg-[#199855]"
                      : "bg-gray-300"
                  } text-white text-sm px-4 py-1 rounded-full shadow-md transition duration-300 cursor-pointer`}
                  onClick={() => setFilterStatus("Completed")}
                >
                  COMPLETED
                </button>
              </div>
            </div>

            <Image src={Human} alt="human" className="w-[300px] h-full" />
          </div>
        </div>

        <div
          className={`w-full flex ${
            width < 600 ? "h-full  flex-col" : " flex-row  h-[70%] "
          }`}
        >
          <div
            className={`flex ${
              width < 600
                ? "justify-center w-full flex-col"
                : " overflow-y-auto w-full"
            } gap-4 p-4`}
          >
            {[...transformedData]
              .filter((item) => item.status === filterStatus)
              .map((item, index) => (
                <div
                  key={index}
                  className={` bg-white rounded-2xl flex flex-col p-6 shadow-2xl gap-5 ${
                    item.status === "Pending"
                      ? "cursor-pointer"
                      : "cursor-default"
                  } ${width < 600 ? "w-full" : "min-w-[350px]"}`}
                  onClick={() =>
                    item.status === "Pending" &&
                    handlequestionnaireclick(item.title, item.period, item.leg)
                  }
                >
                  {/* Card content */}
                  <div className="w-full h-[15%] flex justify-between items-center">
                    <p
                      className={`font-bold text-lg ${
                        item.leg === "Left" ? "text-blue-500" : "text-green-500"
                      }`}
                    >
                      {item.leg} Knee
                    </p>
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

                  <div className="w-full flex-1 flex flex-col justify-start">
                    <p className="font-normal text-[16px] text-[#3B3B3B]">
                      Period: {item.period}
                    </p>
                    <p className="font-semibold text-[20px] text-[#1E1E1E]">
                      {item.title}
                    </p>
                  </div>

                  <div className="w-full flex flex-row justify-between items-center">
                    <div className="flex flex-col items-center">
                      <p className="font-normal text-[15px] text-[#3C3C3C]">
                        Questions
                      </p>
                      <p className="font-semibold text-[16px] text-black">
                        {item.questions}
                      </p>
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="font-normal text-[15px] text-[#3C3C3C]">
                        Deadline
                      </p>
                      <p className="font-semibold text-[16px] text-black">
                        {item.period &&
                        item.period.toUpperCase().includes("PRE OP")
                          ? item.leg === "Left"
                            ? userData?.user?.post_surgery_details_left
                                ?.date_of_surgery
                              ? new Date(
                                  new Date(
                                    userData.user.post_surgery_details_left.date_of_surgery
                                  ).getTime() -
                                    1 * 24 * 60 * 60 * 1000
                                ).toLocaleString("en-IN", {
                                  timeZone: "Asia/Kolkata",
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })
                              : "No Surgery Date"
                            : userData?.user?.post_surgery_details_right
                                ?.date_of_surgery
                            ? new Date(
                                new Date(
                                  userData.user.post_surgery_details_right.date_of_surgery
                                ).getTime() -
                                  1 * 24 * 60 * 60 * 1000
                              ).toLocaleString("en-IN", {
                                timeZone: "Asia/Kolkata",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })
                            : "No Surgery Date"
                          : new Date(
                              new Date(item.deadline).getTime() +
                                14 * 24 * 60 * 60 * 1000
                            ).toLocaleString("en-IN", {
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

        <div className="absolute bottom-0 left-4 z-0 pointer-events-none">
          <Image src={Flower} alt="flower" className="w-32 h-32" />
        </div>

        {performshow && (
          <div
            className="fixed inset-0 z-40 w-full h-full"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.7)", // white with 50% opacity
            }}
          >
            <div
              className={`min-h-screen w-2/5 flex flex-col  items-center justify-center mx-auto z-10 relative ${
                width < 950 ? "p-4 gap-4" : "p-4"
              }`}
            >
              <div
                className={`flex bg-white w-full rounded-2xl ${
                  width < 600 ? "flex-col mx-auto" : "flex-col"
                } gap-2 p-4`}
              >
                <div className="w-full flex flex-row justify-between items-center gap-12">
                  <h2 className="text-xl font-bold text-[#1E1E1E]">
                    Your Performance
                  </h2>
                  <Image
                    src={CloseIcon}
                    alt="closeicon"
                    className="w-4 h-4 cursor-pointer"
                    onClick={handlePerform}
                  />
                </div>

                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => setSelectedLeg("left")}
                    className={`px-4 py-0.5 rounded-full font-semibold text-sm cursor-pointer ${
                      selectedLeg === "left"
                        ? "bg-[#005585] text-white"
                        : "bg-gray-300 text-black"
                    }`}
                  >
                    Left
                  </button>
                  <button
                    onClick={() => setSelectedLeg("right")}
                    className={`px-4 py-0.5 rounded-full font-semibold text-sm cursor-pointer ${
                      selectedLeg === "right"
                        ? "bg-[#005585] text-white"
                        : "bg-gray-300 text-black"
                    }`}
                  >
                    Right
                  </button>
                </div>
                <div
                  className="w-full"
                  style={{ height: "40vh", minHeight: "250px" }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={graphdata}>
                      {/* Hide X-axis */}
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name" // Replace with your actual X-axis field (e.g., "x", "label", etc.)
                        tick={{ fontSize: 12 }}
                        textAnchor="end"
                      />
                      {["oks", "sf12", "koos", "kss", "fjs"].map((key, i) => {
                        const colors = [
                          "#4F46E5", // Indigo
                          "#A855F7", // Purple
                          "#10B981", // Emerald
                          "#F97316", // Orange
                          "#3B82F6", // Blue
                        ];

                        const labels = {
                          oks: "Oxford Knee Score",
                          sf12: "Short Form - 12",
                          koos: "KOOS",
                          kss: "Knee Society Score",
                          fjs: "Forgotten Joint Score",
                        };

                        return (
                          <Line
                            key={key}
                            type="monotone"
                            dataKey={key}
                            connectNulls={true} // Continue connecting lines even when there's no data
                            name={labels[key]}
                            stroke={colors[i]}
                            strokeWidth={2}
                            dot={({ cx, cy, payload, index }) => {
                              // Check if the value exists before rendering the dot
                              if (payload[key] == null || payload[key] === 0) {
                                return null; // Don't render the dot if there's no data
                              }

                              return (
                                <circle
                                  key={`dot-${index}`} // Ensure unique key
                                  cx={cx}
                                  cy={cy}
                                  r={3}
                                  stroke={colors[i]}
                                  strokeWidth={1}
                                  fill={colors[i]}
                                />
                              );
                            }}
                            activeDot={({ payload }) => {
                              // Only show active dot if there's data
                              if (payload[key] == null || payload[key] === 0) {
                                return null; // Don't render active dot if there's no data
                              }

                              return (
                                <circle
                                  r={6}
                                  stroke="black"
                                  strokeWidth={2}
                                  fill="white"
                                />
                              );
                            }}
                          />
                        );
                      })}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
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
      <Terms
        isTermsopen={termsopen}
        isTermsclose={() => {
          setTermsopen(false);
          setpassopen(true);
        }}
      />
    </>
  );
}
