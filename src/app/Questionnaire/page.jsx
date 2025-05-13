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

import QuestionnairePopup from "@/app/Commonquestions/page";
import Timepopup from "@/app/Timepopup/page";

import "@/app/globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

const page = () => {
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

  const router = useRouter();
  const [questionnaireTitle, setQuestionnaireTitle] = useState("");
  const [questionnairePeriod, setQuestionnairePeriod] = useState("");
  const [leg, setLeg] = useState("");
  const [patname, setpatname] = useState("");
  const [patid, setpatid] = useState("");
  const [popupStringArray, setPopupStringArray] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTitle = sessionStorage.getItem("questionnaire_title");
      const storedPeriod = sessionStorage.getItem("questionnaire_period");
      const leg1 = sessionStorage.getItem("questionnaire_leg");
      if (storedTitle && storedPeriod) {
        setQuestionnaireTitle(storedTitle);
        setQuestionnairePeriod(storedPeriod);
        setLeg(leg1);
      }
      setpatname(sessionStorage.getItem("name"));
      setpatid(sessionStorage.getItem("uhid"));
    }
  }, [router.isReady]);

  const [questions, setQuestions] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  const oks = [
    {
      questionText:
        "1. How would you describe the pain you usually have in your knee?",
      type: "single",
      options: [
        "Severe (0)",
        "Moderate (1)",
        "Mild (2)",
        "Very mild (3)",
        "None (4)",
      ],
    },
    {
      questionText:
        "2. Have you had trouble washing and drying yourself because of your knee?",
      type: "single",
      options: [
        "Impossible to do (0)",
        "Extreme difficulty (1)",
        "Moderate trouble (2)",
        "Very little trouble (3)",
        "No trouble at all (4)",
      ],
    },
    {
      questionText:
        "3. Have you had trouble getting in and out of a car or using public transportation due to your knee?",
      type: "single",
      options: [
        "Impossible to do (0)",
        "Extreme difficulty (1)",
        "Moderate trouble (2)",
        "Very little trouble (3)",
        "No trouble at all (4)",
      ],
    },
    {
      questionText:
        "4. For how long are you able to walk before the pain becomes severe?",
      type: "single",
      options: [
        "Around the house only (0)",
        "5–15 minutes (1)",
        "16–30 minutes (2)",
        "30 minutes or more (3)",
        "No pain (4)",
      ],
    },
    {
      questionText:
        "5. After a meal, how painful has it been to stand up from a chair because of your knee?",
      type: "single",
      options: [
        "Unbearable (0)",
        "Very painful (1)",
        "Moderately painful (2)",
        "Slightly painful (3)",
        "Not at all painful (4)",
      ],
    },
    {
      questionText: "6. Have you been limping because of your knee?",
      type: "single",
      options: [
        "All of the time (0)",
        "Most of the time (1)",
        "Often, not just at first (2)",
        "Sometimes or just at first (3)",
        "Rarely/never (4)",
      ],
    },
    {
      questionText: "7. Could you kneel down and get up again afterwards?",
      type: "single",
      options: [
        "No, impossible (0)",
        "With extreme difficulty (1)",
        "With moderate difficulty (2)",
        "With little difficulty (3)",
        "Yes, easily (4)",
      ],
    },
    {
      questionText: "8. Are you troubled by pain in your knee at night?",
      type: "single",
      options: [
        "Every night (0)",
        "Most nights (1)",
        "Some nights (2)",
        "Only one or two nights (3)",
        "Not at all (4)",
      ],
    },
    {
      questionText:
        "9. How much has your knee interfered with your usual work (including housework)?",
      type: "single",
      options: [
        "Totally (0)",
        "Greatly (1)",
        "Moderately (2)",
        "A little bit (3)",
        "Not at all (4)",
      ],
    },
    {
      questionText: "10. Have you felt that your knee might suddenly give way?",
      type: "single",
      options: [
        "All of the time (0)",
        "Most of the time (1)",
        "Often (2)",
        "Sometimes (3)",
        "Rarely/never (4)",
      ],
    },
    {
      questionText: "11. Could you do household shopping on your own?",
      type: "single",
      options: [
        "No, impossible (0)",
        "With extreme difficulty (1)",
        "With moderate difficulty (2)",
        "With little difficulty (3)",
        "Yes, easily (4)",
      ],
    },
    {
      questionText: "12. Could you walk down a flight of stairs?",
      type: "single",
      options: [
        "No, impossible (0)",
        "With extreme difficulty (1)",
        "With moderate difficulty (2)",
        "With little difficulty (3)",
        "Yes, easily (4)",
      ],
    },
  ];

  const sf = [
    {
      questionText: "In general, would you say your health is:",
      type: "single",
      options: [
        "Excellent (1)",
        "Very Good (2)",
        "Good (3)",
        "Fair (4)",
        "Poor (5)",
      ],
    },
    {
      questionText:
        "Does your health now limit you in moderate activities, such as moving a table, pushing a vacuum cleaner, bowling, or playing golf?",
      type: "single",
      options: [
        "Yes, Limited A Lot (1)",
        "Yes, Limited A Little (2)",
        "No, Not Limited At All (3)",
      ],
    },
    {
      questionText:
        "Does your health now limit you in climbing several flights of stairs?",
      type: "single",
      options: [
        "Yes, Limited A Lot (1)",
        "Yes, Limited A Little (2)",
        "No, Not Limited At All (3)",
      ],
    },
    {
      questionText:
        "During the past 4 weeks, as a result of your physical health, did you accomplish less than you would like in work or other regular activities?",
      type: "single",
      options: ["Yes (1)", "No (2)"],
    },
    {
      questionText:
        "During the past 4 weeks, as a result of your physical health, were you limited in the kind of work or other activities you could perform?",
      type: "single",
      options: ["Yes (1)", "No (2)"],
    },
    {
      questionText:
        "During the past 4 weeks, as a result of any emotional problems (such as feeling depressed or anxious), did you accomplish less than you would like?",
      type: "single",
      options: ["Yes (1)", "No (2)"],
    },
    {
      questionText:
        "During the past 4 weeks, as a result of any emotional problems (such as feeling depressed or anxious), did you do work or other activities less carefully than usual?",
      type: "single",
      options: ["Yes (1)", "No (2)"],
    },
    {
      questionText:
        "During the past 4 weeks, how much did pain interfere with your normal work (including both work outside the home and housework)?",
      type: "single",
      options: [
        "Not At All (1)",
        "A Little Bit (2)",
        "Moderately (3)",
        "Quite A Bit (4)",
        "Extremely (5)",
      ],
    },
    {
      questionText:
        "During the past 4 weeks, how much of the time have you felt calm and peaceful?",
      type: "single",
      options: [
        "All of the Time (1)",
        "Most of the Time (2)",
        "A Good Bit of the Time (3)",
        "Some of the Time (4)",
        "A Little of the Time (5)",
        "None of the Time (6)",
      ],
    },
    {
      questionText:
        "During the past 4 weeks, how much of the time did you have a lot of energy?",
      type: "single",
      options: [
        "All of the Time (1)",
        "Most of the Time (2)",
        "A Good Bit of the Time (3)",
        "Some of the Time (4)",
        "A Little of the Time (5)",
        "None of the Time (6)",
      ],
    },
    {
      questionText:
        "During the past 4 weeks, how much of the time have you felt downhearted and blue?",
      type: "single",
      options: [
        "All of the Time (1)",
        "Most of the Time (2)",
        "A Good Bit of the Time (3)",
        "Some of the Time (4)",
        "A Little of the Time (5)",
        "None of the Time (6)",
      ],
    },
    {
      questionText:
        "During the past 4 weeks, how much of the time has your physical health or emotional problems interfered with your social activities (like visiting with friends, relatives, etc.)?",
      type: "single",
      options: [
        "All of the Time (1)",
        "Most of the Time (2)",
        "A Good Bit of the Time (3)",
        "Some of the Time (4)",
        "A Little of the Time (5)",
        "None of the Time (6)",
      ],
    },
  ];

  const koos = [
    {
      questionText:
        "S1. How severe is your knee stiffness after first wakening in the morning?",
      type: "single",
      options: [
        "None (0)",
        "Mild (1)",
        "Moderate (2)",
        "Severe (3)",
        "Extreme (4)",
      ],
    },
    {
      questionText: "P1. Amount of pain while twisting/pivoting your knee",
      type: "single",
      options: [
        "None (0)",
        "Mild (1)",
        "Moderate (2)",
        "Severe (3)",
        "Extreme (4)",
      ],
    },
    {
      questionText: "P2. Amount of pain while straightening knee fully",
      type: "single",
      options: [
        "None (0)",
        "Mild (1)",
        "Moderate (2)",
        "Severe (3)",
        "Extreme (4)",
      ],
    },
    {
      questionText: "P3. Amount of pain while going up or down stairs",
      type: "single",
      options: [
        "None (0)",
        "Mild (1)",
        "Moderate (2)",
        "Severe (3)",
        "Extreme (4)",
      ],
    },
    {
      questionText: "P4. Amount of pain while standing upright",
      type: "single",
      options: [
        "None (0)",
        "Mild (1)",
        "Moderate (2)",
        "Severe (3)",
        "Extreme (4)",
      ],
    },
    {
      questionText: "A1. Degree of difficulty in rising from sitting",
      type: "single",
      options: [
        "None (0)",
        "Mild (1)",
        "Moderate (2)",
        "Severe (3)",
        "Extreme (4)",
      ],
    },
    {
      questionText:
        "A2. Degree of difficulty in bending to the floor/picking up an object",
      type: "single",
      options: [
        "None (0)",
        "Mild (1)",
        "Moderate (2)",
        "Severe (3)",
        "Extreme (4)",
      ],
    },
  ];

  const ksspreop = [
    {
      questionText:
        "Currently, how satisfied are you with the pain level of your knee while sitting?",
      type: "single",
      options: [
        "Very Satisfied (no pain) (0)",
        "Satisfied (1)",
        "Neutral (2)",
        "Dissatisfied (3)",
        "Very Dissatisfied (severe pain) (4)",
      ],
    },
    {
      questionText:
        "Currently, how satisfied are you with the pain level of your knee while lying in bed?",
      type: "single",
      options: [
        "Very Satisfied (0)",
        "Satisfied (1)",
        "Neutral (2)",
        "Dissatisfied (3)",
        "Very Dissatisfied (4)",
      ],
    },
    {
      questionText:
        "Currently, how satisfied are you with your knee function while getting out of bed?",
      type: "single",
      options: [
        "Very Satisfied (0)",
        "Satisfied (1)",
        "Neutral (2)",
        "Dissatisfied (3)",
        "Very Dissatisfied (4)",
      ],
    },
    {
      questionText:
        "Currently, how satisfied are you with your knee function while performing light household duties?",
      type: "single",
      options: [
        "Very Satisfied (0)",
        "Satisfied (1)",
        "Neutral (2)",
        "Dissatisfied (3)",
        "Very Dissatisfied (4)",
      ],
    },
    {
      questionText:
        "Currently, how satisfied are you with your knee function while performing leisure recreational activities?",
      type: "single",
      options: [
        "Very Satisfied (0)",
        "Satisfied (1)",
        "Neutral (2)",
        "Dissatisfied (3)",
        "Very Dissatisfied (4)",
      ],
    },
    {
      questionText:
        "Do you expect your knee joint replacement surgery will relieve your knee pain?",
      type: "single",
      options: [
        "No, Not at all (1)",
        "Yes, a little bit (2)",
        "Yes, somewhat (3)",
        "Yes, a moderate amount (4)",
        "Yes, a lot (5)",
      ],
    },
    {
      questionText:
        "Do you expect your surgery will help you carry out your normal activities of daily living?",
      type: "single",
      options: [
        "No, Not at all (1)",
        "Yes, a little bit (2)",
        "Yes, somewhat (3)",
        "Yes, a moderate amount (4)",
        "Yes, a lot (5)",
      ],
    },
    {
      questionText:
        "Do you expect your surgery will help you perform leisure, recreational or sports activities?",
      type: "single",
      options: [
        "No, Not at all (1)",
        "Yes, a little bit (2)",
        "Yes, somewhat (3)",
        "Yes, a moderate amount (4)",
        "Yes, a lot (5)",
      ],
    },
  ];

  const ksspostop = [
    {
      questionText:
        "Currently, how satisfied are you with the pain level of your knee while sitting?",
      type: "single",
      options: [
        "Very Satisfied (0)",
        "Satisfied (1)",
        "Neutral (2)",
        "Dissatisfied (3)",
        "Very Dissatisfied (4)",
      ],
    },
    {
      questionText:
        "Currently, how satisfied are you with the pain level of your knee while lying in bed?",
      type: "single",
      options: [
        "Very Satisfied (0)",
        "Satisfied (1)",
        "Neutral (2)",
        "Dissatisfied (3)",
        "Very Dissatisfied (4)",
      ],
    },
    {
      questionText:
        "Currently, how satisfied are you with your knee function while getting out of bed?",
      type: "single",
      options: [
        "Very Satisfied (0)",
        "Satisfied (1)",
        "Neutral (2)",
        "Dissatisfied (3)",
        "Very Dissatisfied (4)",
      ],
    },
    {
      questionText:
        "Currently, how satisfied are you with your knee function while performing light household duties?",
      type: "single",
      options: [
        "Very Satisfied (0)",
        "Satisfied (1)",
        "Neutral (2)",
        "Dissatisfied (3)",
        "Very Dissatisfied (4)",
      ],
    },
    {
      questionText:
        "Currently, how satisfied are you with your knee function while performing leisure recreational activities?",
      type: "single",
      options: [
        "Very Satisfied (0)",
        "Satisfied (1)",
        "Neutral (2)",
        "Dissatisfied (3)",
        "Very Dissatisfied (4)",
      ],
    },
    {
      questionText: "My expectations for pain relief were...",
      type: "single",
      options: [
        'Too High - "I\'m a lot worse than I thought" (1)',
        'High - "I\'m somewhat worse than I thought" (2)',
        'Just Right - "My expectations were met" (3)',
        'Low - "I\'m somewhat better than I thought" (4)',
        'Too Low - "I\'m a lot better than I thought" (5)',
      ],
    },
    {
      questionText:
        "My expectations for being able to do my normal activities of daily living were...",
      type: "single",
      options: [
        'Too High - "I\'m a lot worse than I thought" (1)',
        'High - "I\'m somewhat worse than I thought" (2)',
        'Just Right - "My expectations were met" (3)',
        'Low - "I\'m somewhat better than I thought" (4)',
        'Too Low - "I\'m a lot better than I thought" (5)',
      ],
    },
    {
      questionText:
        "My expectations for being able to do my leisure, recreational or sports activities were...",
      type: "single",
      options: [
        'Too High - "I\'m a lot worse than I thought" (1)',
        'High - "I\'m somewhat worse than I thought" (2)',
        'Just Right - "My expectations were met" (3)',
        'Low - "I\'m somewhat better than I thought" (4)',
        'Too Low - "I\'m a lot better than I thought" (5)',
      ],
    },
  ];

  const fjs = [
    {
      questionText: "Are you aware of your knee joint while in bed at night?",
      type: "single",
      options: [
        "Never (1)",
        "Almost Never (2)",
        "Seldom (3)",
        "Sometimes (4)",
        "Mostly (5)",
      ],
    },
    {
      questionText:
        "Are you aware of your knee joint while sitting more than an hour?",
      type: "single",
      options: [
        "Never (1)",
        "Almost Never (2)",
        "Seldom (3)",
        "Sometimes (4)",
        "Mostly (5)",
      ],
    },
    {
      questionText:
        "Are you aware of your knee joint while walking more than 15 minutes?",
      type: "single",
      options: [
        "Never (1)",
        "Almost Never (2)",
        "Seldom (3)",
        "Sometimes (4)",
        "Mostly (5)",
      ],
    },
    {
      questionText:
        "Are you aware of your knee joint while taking a bath or shower?",
      type: "single",
      options: [
        "Never (1)",
        "Almost Never (2)",
        "Seldom (3)",
        "Sometimes (4)",
        "Mostly (5)",
      ],
    },
    {
      questionText:
        "Are you aware of your knee joint while traveling in a car?",
      type: "single",
      options: [
        "Never (1)",
        "Almost Never (2)",
        "Seldom (3)",
        "Sometimes (4)",
        "Mostly (5)",
      ],
    },
    {
      questionText: "Are you aware of your knee joint while climbing stairs?",
      type: "single",
      options: [
        "Never (1)",
        "Almost Never (2)",
        "Seldom (3)",
        "Sometimes (4)",
        "Mostly (5)",
      ],
    },
    {
      questionText:
        "Are you aware of your knee joint while walking on uneven ground?",
      type: "single",
      options: [
        "Never (1)",
        "Almost Never (2)",
        "Seldom (3)",
        "Sometimes (4)",
        "Mostly (5)",
      ],
    },
    {
      questionText:
        "Are you aware of your knee joint while standing up from a low sitting position?",
      type: "single",
      options: [
        "Never (1)",
        "Almost Never (2)",
        "Seldom (3)",
        "Sometimes (4)",
        "Mostly (5)",
      ],
    },
    {
      questionText:
        "Are you aware of your knee joint while standing for long periods?",
      type: "single",
      options: [
        "Never (1)",
        "Almost Never (2)",
        "Seldom (3)",
        "Sometimes (4)",
        "Mostly (5)",
      ],
    },
    {
      questionText:
        "Are you aware of your knee joint while doing housework or gardening?",
      type: "single",
      options: [
        "Never (1)",
        "Almost Never (2)",
        "Seldom (3)",
        "Sometimes (4)",
        "Mostly (5)",
      ],
    },
    {
      questionText:
        "Are you aware of your knee joint while taking a walk or hiking?",
      type: "single",
      options: [
        "Never (1)",
        "Almost Never (2)",
        "Seldom (3)",
        "Sometimes (4)",
        "Mostly (5)",
      ],
    },
    {
      questionText:
        "Are you aware of your knee joint while doing your favourite sport?",
      type: "single",
      options: [
        "Never (1)",
        "Almost Never (2)",
        "Seldom (3)",
        "Sometimes (4)",
        "Mostly (5)",
      ],
    },
  ];

  useEffect(() => {
    if (!questionnaireTitle) return;

    const t = questionnaireTitle.trim().toLowerCase();
    console.log("Questionnaire", t);

    let selectedQuestions = [];

    if (t === "oxford knee score (oks)") {
      selectedQuestions = oks;
    } else if (t === "forgotten joint score (fjs)") {
      selectedQuestions = fjs;
    } else if (t.includes("koos, jr")) {
      selectedQuestions = koos;
    } else if (t === "knee society score (kss)") {
      const p = questionnairePeriod.trim().toLowerCase();
      console.log("Inside kss", p);
      selectedQuestions = p.includes("pre") ? ksspreop : ksspostop;
    } else if (t === "short form - 12 (sf-12)") {
      selectedQuestions = sf;
    }

    if (selectedQuestions.length > 0) {
      const shuffledQuestions = selectedQuestions.map((q) => ({
        ...q,
        options: shuffleArray(q.options),
      }));
      setQuestions(shuffledQuestions);
      console.log("Questions loaded", shuffledQuestions);
    }
  }, [questionnaireTitle, questionnairePeriod]);

  //   {
  //     questionText:
  //       "1. How would you describe the pain you usually have in your knee?",
  //     type: "single",
  //     options: ["No pain", "Very mild", "Mild", "Moderate", "Severe"],
  //   },
  //   {
  //     questionText: "2. Have you had any trouble washing and drying yourself?",
  //     type: "multiple",
  //     options: [
  //       "No trouble",
  //       "Little trouble",
  //       "Some trouble",
  //       "Extreme difficulty",
  //     ],
  //   },
  //   {
  //     questionText: "3. Are you able to walk down stairs normally?",
  //     type: "single",
  //     options: ["Yes", "Only with support", "No"],
  //   },
  //   {
  //     questionText: "4. Can you kneel down and get up again afterwards?",
  //     type: "single",
  //     options: ["Easily", "With some difficulty", "Not at all"],
  //   },
  //   {
  //     questionText: "5. Do you feel confident standing up from a chair?",
  //     type: "multiple",
  //     options: ["Always", "Sometimes", "Rarely", "Never"],
  //   },
  // ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("oks_answers");
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  const [warning, setWarning] = useState("");

  const currentQuestion = questions[currentIndex];

  const handleOptionClick = (option) => {
    const id = currentIndex;
    const type = currentQuestion.type;
    let updatedAnswers;

    if (type === "single") {
      updatedAnswers = { ...answers, [id]: [option] };
    } else {
      const selected = answers[id] || [];
      if (selected.includes(option)) {
        updatedAnswers = {
          ...answers,
          [id]: selected.filter((o) => o !== option),
        };
      } else {
        updatedAnswers = {
          ...answers,
          [id]: [...selected, option],
        };
      }
    }

    setAnswers(updatedAnswers);

    if (typeof window !== "undefined") {
      sessionStorage.setItem("oks_answers", JSON.stringify(updatedAnswers));
    }
  };

  const isSelected = (option) => (answers[currentIndex] || []).includes(option);

  const goNext = () => {
    setWarning(""); // Clear previous warning if any
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setWarning("");
    }
  };

  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleConfirmSubmit = () => {
    console.log("Form submitted successfully!");
    handleSubmit();
  };

  const handleCancelSubmit = () => {
    console.log("Submission cancelled.");
    setShowConfirmation(false);
  };

  const handleSubmit = async () => {
    if (isSubmitting) {
      showWarning("Please wait Submitting on progress...");
      return; // Prevent double submission
    }
    const unanswered = questions.filter((_, idx) => {
      const ans = answers[idx];
      return !ans || ans.length === 0;
    });
    console.log("Answers", answers);

    if (unanswered.length > 0) {
      setWarning("Please answer all questions before submitting.");
      setTimeout(() => setWarning(false), 2500);
    } else {
      setWarning("");
      console.log("Submitted answers:", answers);
      const t = questionnaireTitle.trim().toLowerCase();

      let scores = [];

      if (
        t === "oxford knee score (oks)" ||
        t ===
          "knee injury and ostheoarthritis outcome score, joint replacement (koos, jr)" ||
        t === "forgotten joint score (fjs)"
      ) {
        const total = calculateTotalScore(answers);
        console.log("Total Score:", total);
        scores = [total];
      } else if (t === "short form - 12 (sf-12)") {
        const [total, pcs, mcs] = calculateSF12Scores(answers);
        console.log("SF-12 Scores -> Total:", total, "PCS:", pcs, "MCS:", mcs);
        scores = [total, pcs, mcs];
      } else if (t === "knee society score (kss)") {
        const score = calculateKneeSocietyScore(answers);
        console.log("KSS Normalized Score:", score);
        scores = [score];
      }
      setIsSubmitting(true);
      console.log("Total KSS Score:", scores);
      await sendQuestionnaireScores(scores, Date.now());
      await updateQuestionnaireStatus();

      if (typeof window !== "undefined") {
        sessionStorage.removeItem("oks_answers");
      }
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("popup_answers");
      }
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("timepopup");
      }
      setShowConfirmation(false);
      router.replace("/");
      console.log("Submitted answers:", answers);
    }
  };

  const sendQuestionnaireScores = async (score, timestamp) => {
    if (typeof window !== "undefined") {
      try {
        const uhid = sessionStorage.getItem("uhid"); // Get user UHID
        const name = questionnaireTitle; // e.g. "Oxford Knee Score"
        const period = questionnairePeriod; // Pre-op / Post-op or similar

        // Construct the payload
        const scoreArray = score.map((s) => parseFloat(s)); // ensure numbers
        if (leg === "Left") {
          const payload = {
            uhid: uhid,
            questionnaire_scores_left: [
              {
                name: name,
                score: scoreArray,
                period: period,
                timestamp: timestamp,
                others: popupStringArray,
              },
            ],
          };
          // console.log("Sending to:", `${API_URL}add-questionnaire-scores`);
          console.log("PUT Payload:", payload);

          const response = await axios.put(
            API_URL + "add-questionnaire-scores-left",
            payload
          );

          console.log("PUT Response:", response.data);
        }
        if (leg === "Right") {
          const payload = {
            uhid: uhid,
            questionnaire_scores_right: [
              {
                name: name,
                score: scoreArray,
                period: period,
                timestamp: timestamp,
                others: popupStringArray,
              },
            ],
          };
          // console.log("Sending to:", `${API_URL}add-questionnaire-scores`);
          console.log("PUT Payload:", payload);

          const response = await axios.put(
            API_URL + "add-questionnaire-scores-right",
            payload
          );

          console.log("PUT Response:", response.data);
        }
        // Optional: Show success toast or alert
        // toast.success("Update successful!");

        // Call status updater
      } catch (error) {
        console.error("PUT Error:", error);
        // toast.error("Update failed!");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const updateQuestionnaireStatus = async () => {
    if (typeof window !== "undefined") {
      const uhid = sessionStorage.getItem("uhid");
      const cmp = 1;
      try {
        const payload = {
          uhid: uhid,
          name: questionnaireTitle, // same as HomeFragment.selectedquestionnaire
          period: questionnairePeriod, // same as HomeFragment.quesperiod
          completed: cmp,
          leg: leg.toLowerCase()

        };

        setIsSubmitting(false);

        console.log("Sending to:", `${API_URL}update-questionnaire-status`);
        console.log("Payload:", payload);

        const response = await axios.put(
          API_URL + "update-questionnaire-status",
          payload
        );

        console.log("PUT Response (status):", response.data);
        alert("✅ Questionnaire Submitted Successfully!");
      } catch (error) {
        console.error("PUT Error (status):", error);
        // alert("❌ Failed to update questionnaire status.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  function calculateTotalScore(answers) {
    let totalScore = 0;

    Object.values(answers).forEach((arr) => {
      if (arr.length > 0) {
        const answer = arr[0]; // assuming single-answer selection per question
        const match = answer.match(/\((\d+)\)/);
        if (match) {
          totalScore += parseInt(match[1]);
        }
      }
    });

    return totalScore;
  }

  function calculateKneeSocietyScore(selectedAnswers) {
    let totalScore = 0;

    for (let i = 0; i < 8; i++) {
      const answer = selectedAnswers[i];
      if (!answer) continue;

      const answerText = Array.isArray(answer) ? answer[0] : answer;
      let score = 0;

      if (i < 5) {
        if (answerText.includes("(0)")) score = 4;
        else if (answerText.includes("(1)")) score = 3;
        else if (answerText.includes("(2)")) score = 2;
        else if (answerText.includes("(3)")) score = 1;
        else if (answerText.includes("(4)")) score = 0;
      } else {
        if (answerText.includes("(1)")) score = 1;
        else if (answerText.includes("(2)")) score = 2;
        else if (answerText.includes("(3)")) score = 3;
        else if (answerText.includes("(4)")) score = 4;
        else if (answerText.includes("(5)")) score = 5;
      }

      totalScore += score;
    }

    const minScore = 3;
    const maxScore = 35;
    const normalizedScore = Math.max(
      0,
      ((totalScore - minScore) / (maxScore - minScore)) * 100
    );

    return Math.round(normalizedScore);
  }

  function calculateSF12Scores(selectedRadioAnswers) {
    const pcsIndices = [0, 1, 2, 3, 4, 7]; // GH, PF1, PF2, RP1, RP2, BP
    const mcsIndices = [5, 6, 8, 9, 10, 11]; // RE1, RE2, MH1, VT, MH2, SF

    const reverseScoring = [
      true,
      false,
      false,
      false,
      false,
      false,
      false,
      true,
      true,
      true,
      false,
      false,
    ];

    const rawScores = new Array(12).fill(0);

    for (let i = 0; i < 12; i++) {
      const answer = selectedRadioAnswers[i]?.[0]; // Access first string from array
      if (!answer) continue;

      let value = 1;
      try {
        const start = answer.lastIndexOf("(") + 1;
        const end = answer.lastIndexOf(")");
        value = parseInt(answer.substring(start, end));
      } catch (e) {
        value = 1; // fallback
      }

      let max;
      if ([8, 9, 10, 11].includes(i)) {
        max = 6;
      } else if ([0, 7].includes(i)) {
        max = 5;
      } else if ([1, 2].includes(i)) {
        max = 3;
      } else if ([3, 4, 5, 6].includes(i)) {
        max = 2;
      } else {
        max = 5; // fallback
      }

      let score;
      if (reverseScoring[i]) {
        score = (max - value) * (100 / (max - 1));
      } else {
        score = (value - 1) * (100 / (max - 1));
      }
      console.log("SF 12", i + " " + value + " " + max);

      rawScores[i] = score;
    }

    const pcsScore =
      pcsIndices.reduce((acc, i) => acc + rawScores[i], 0) / pcsIndices.length;
    const mcsScore =
      mcsIndices.reduce((acc, i) => acc + rawScores[i], 0) / mcsIndices.length;
    const totalScore = pcsScore + mcsScore;

    // console.log("SF 12",totalScore+" "+pcsScore+" "+mcsScore);

    return [
      Math.round(totalScore / 2),
      Math.round(pcsScore / 2),
      Math.round(mcsScore / 2),
    ];
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only react if currentQuestion exists
      if (!currentQuestion || !currentQuestion.options) return;

      const optionCount = currentQuestion.options.length;
      const pressedNumber = parseInt(e.key, 10);

      // Check if a valid number key was pressed (1-based)
      if (
        !isNaN(pressedNumber) &&
        pressedNumber >= 1 &&
        pressedNumber <= optionCount
      ) {
        const optionToSelect = currentQuestion.options[pressedNumber - 1];
        handleOptionClick(optionToSelect);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentQuestion, handleOptionClick]);

  const [popupOpen, setPopupOpen] = useState(false);
  const [showInitialPopup, setShowInitialPopup] = useState(true);

  const handlePopupSubmit = (data) => {
    const stringArray = Object.entries(data).map(
      ([key, value]) => `${key}: ${value}`
    );
    setPopupStringArray(stringArray); // <-- Save globally
    // Save to sessionStorage
    if (typeof window !== "undefined") {
      sessionStorage.setItem("popup_answers", JSON.stringify(stringArray));
    }
    console.log("Converted Array:", popupStringArray);
  };

  useEffect(() => {
    console.log("Loaded", popupStringArray);
  }, [popupStringArray]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedPopupAnswers = sessionStorage.getItem("popup_answers");
      const timepop = sessionStorage.getItem("timepopup");

      console.log("Timepopup status", timepop);

      if (timepop !== null) {
        setShowInitialPopup(timepop === "true"); // <-- Convert properly
      }

      if (storedPopupAnswers) {
        setPopupOpen(false);
        setPopupStringArray(JSON.parse(storedPopupAnswers));
      }
    }
  }, []);

  const handleProceed = () => {
    setShowInitialPopup(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("timepopup", "false"); // if you ever need to reset manually
    }
    setPopupOpen(true);
  };

  return (
    <>
      <div className="relative">
        <div
          className={` bg-white flex flex-col relative ${
            width < 850 && width >= 700
              ? "h-screen  w-screen"
              : width < 700
              ? "h-full  w-full"
              : "h-screen  w-screen"
          }`}
        >
          <div
            className={`w-full  flex flex-col bg-white ${
              width < 850 ? "h-[30%]" : "h-[12%]"
            }`}
          >
            <div
              className={`w-full flex items-center px-[30px]  ${
                width < 850
                  ? "flex-col h-fit justify-center gap-4 py-[20px]"
                  : "flex-row h-[95%] justify-between py-[20px]"
              }`}
            >
              <p
                className={` font-bold text-base text-black flex items-center ${
                  width < 850
                    ? "w-full h-fit justify-center"
                    : "w-[45%] h-full "
                }`}
              >
                {questionnaireTitle}
              </p>
              <div
                className={`w-[5%]  flex justify-center items-center ${
                  width < 850 ? "h-fit" : "h-full"
                }`}
              >
                <Image src={Qicon} alt="qicon" className="w-10 h-10" />
              </div>
              <div
                className={`h-full flex flex-col font-bold text-sm text-[#545454] ${
                  width < 850 ? "w-full gap-2" : "w-[45%]"
                }`}
              >
                <p
                  className={`w-full  ${
                    width < 850 ? "text-center h-fit" : "text-end h-1/2 "
                  }`}
                >
                  PATIENT NAME: {patname}
                </p>
                <p
                  className={`w-full  ${
                    width < 850 ? "text-center  h-fit" : "text-end  h-1/2"
                  }`}
                >
                  PATIENT ID: {patid}
                </p>
              </div>
            </div>
            <div className={`w-full h-3 bg-[#7075DB]`} />
          </div>

          {questions.length === 0 ? (
            <div className="text-center text-gray-600 text-lg">
              Loading questions...
            </div>
          ) : (
            <div
              className={`w-full flex  justify-center bg-white   gap-10 ${
                width < 850 && width >= 700
                  ? "h-full items-start pt-0 flex-row px-20"
                  : width < 700
                  ? "flex-col py-10 px-10"
                  : "h-[80%] pt-10 flex-row px-30"
              }`}
            >
              <div
                className={`h-full ${
                  width < 850 && width >= 700
                    ? "w-1/2"
                    : width < 700
                    ? "w-full"
                    : "w-1/3"
                }`}
              >
                <div className="w-full h-full flex flex-col items-center gap-4 overflow-y-auto p-4">
                  <h2 className="text-center font-bold text-lg text-black">
                    Question Palette
                  </h2>

                  <div className="grid grid-cols-3 gap-4">
                    {questions.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold cursor-pointer
          ${
            answers[idx] && answers[idx].length > 0
              ? "bg-green-500"
              : "bg-red-500"
          }
          ${currentIndex === idx ? "ring-2 ring-[#005585]" : ""}
        `}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-col items-start mt-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2 text-black text-lg">
                      <div className="w-4 h-4 bg-green-500 rounded-full "></div>
                      Answered
                    </div>
                    <div className="flex items-center gap-2 text-black text-lg">
                      <div className="w-4 h-4 bg-red-500 rounded-full "></div>
                      Unanswered
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`h-full ${
                  width < 850 && width >= 700
                    ? "w-1/2"
                    : width < 700
                    ? "w-full"
                    : "w-1/3"
                }`}
              >
                <div
                  className={`w-full  bg-[#7075DB] rounded-2xl flex flex-col p-6 gap-2 ${
                    width < 700 ? "h-full" : "h-full"
                  }`}
                >
                  <p className="text-sm text-black text-center font-semibold">
                    Question {currentIndex + 1} / {questions.length}
                  </p>
                  {questions[currentIndex] && (
                    <p
                      className={`w-full  text-white text-base font-semibold ${
                        width < 1200 && width >= 700
                          ? "h-fit"
                          : width < 700
                          ? "h-full"
                          : "h-[40%]"
                      }`}
                    >
                      {questions[currentIndex].questionText}
                    </p>
                  )}

                  <div
                    className={`w-full  flex flex-col gap-4 text-white overflow-y-auto ${
                      width < 1200 && width >= 700
                        ? "h-fit"
                        : width < 700
                        ? "h-full"
                        : "h-[60%]"
                    }`}
                  >
                    {currentQuestion &&
                      currentQuestion.options.map((option, idx) => (
                        <label
                          key={idx}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          {currentQuestion.type === "single" ? (
                            <input
                              type="radio"
                              name={`question-${currentIndex}`}
                              value={option}
                              checked={isSelected(option)}
                              onChange={() => handleOptionClick(option)}
                              className="accent-[#005585]"
                            />
                          ) : (
                            <input
                              type="checkbox"
                              value={option}
                              checked={isSelected(option)}
                              onChange={() => handleOptionClick(option)}
                              className="accent-[#005585]"
                            />
                          )}
                          <span className="text-sm">{`${
                            idx + 1
                          }. ${option}`}</span>
                        </label>
                      ))}
                  </div>
                  {warning && (
                    <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50">
                      <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-3 rounded-lg shadow-lg animate-fade-in-out">
                        {warning}
                      </div>
                    </div>
                  )}
                  <div className={`w-full h-[10%]`}>
                    <div className="w-full flex flex-row justify-center items-center pt-2">
                      <div className="w-1/2 flex flex-row justify-start items-center">
                        {currentIndex !== 0 && (
                          <p
                            className="font-semibold text-black text-sm cursor-pointer"
                            onClick={goPrev}
                          >
                            PREVIOUS
                          </p>
                        )}
                      </div>
                      <div className="w-1/2 flex flex-row justify-end items-center">
                        <p
                          className="font-semibold rounded-full px-3 py-[1px] cursor-pointer text-center text-white text-sm border-[#005585] border-2"
                          style={{ backgroundColor: "rgba(0, 85, 133, 0.9)" }}
                          onClick={() => {
                            if (currentIndex === questions.length - 1) {
                              // On last question, validate all answers
                              const unanswered = questions.filter((_, idx) => {
                                const ans = answers[idx];
                                return !ans || ans.length === 0;
                              });

                              if (unanswered.length > 0) {
                                setWarning(
                                  "Please answer all questions before submitting."
                                );
                                setTimeout(() => {
                                  setWarning("");
                                }, 2500);
                              } else {
                                setWarning("");
                                !isSubmitting
                                  ? setShowConfirmation(true)
                                  : undefined;
                              }
                            } else {
                              setWarning("");
                              goNext(); // Just move to next question if not last
                            }
                          }}
                        >
                          {currentIndex === questions.length - 1
                            ? isSubmitting
                              ? "POSTING..."
                              : "POST"
                            : "NEXT"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={` h-full ${
                  width < 850 && width >= 700
                    ? "w-1/2"
                    : width < 700
                    ? "w-full"
                    : "w-1/3"
                }`}
              >
                <Image
                  src={leg === "Left" ? Leftleg : Rightleg}
                  alt="qicon"
                  className="w-full h-full"
                />
              </div>
            </div>
          )}

          <div className="absolute bottom-0 left-4">
            <Image src={Flower} alt="flower" className="w-40 h-32" />
          </div>

          {showConfirmation && (
            <div
              className="fixed inset-0 flex items-center justify-center z-50"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.7)", // white with 50% opacity
              }}
            >
              <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md flex flex-col gap-4">
                <h2 className="text-xl font-bold text-center text-gray-800">
                  Confirm Submission
                </h2>
                <p className="text-gray-600 text-center">
                  Are you sure you want to submit the Questionnaire?
                </p>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={handleCancelSubmit}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmSubmit}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <QuestionnairePopup
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        onSubmit={handlePopupSubmit}
      />
      {showInitialPopup && <Timepopup onProceed={handleProceed} />}
    </>
  );
};

export default page;
