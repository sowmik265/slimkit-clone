"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import clsx from "clsx";
import surveyScreens from "/data/survey";

const quizFlow = surveyScreens;
const questionSteps = quizFlow.filter((step) => step.type !== "static");
const totalModules = Math.max(...questionSteps.map((q) => q.module));

export default function QuizPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const currentStep = quizFlow[currentIndex];

  const [selectedUnit, setSelectedUnit] = useState("FT");
  const [feet, setFeet] = useState("");
  const [inch, setInch] = useState("");
  const [cm, setCm] = useState("");

  const [selectedDate, setSelectedDate] = useState("");

  const handleAnswer = (answer) => {
    setAnswers((prev) => ({ ...prev, [currentStep.id]: answer }));
    if (currentIndex < quizFlow.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleContinue = (skipped = false) => {
    const answer = skipped ? "skipped" : selectedDate;

    // You can optionally show an alert if Done is clicked without picking a date
    if (!skipped && !selectedDate) {
      alert("Please select a date or skip the question.");
      return;
    }

    setAnswers((prev) => ({ ...prev, [currentStep.id]: answer }));

    if (currentIndex < quizFlow.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleNextStep = () => {
    // Validation
    let valid = true;
    let answerValue = "";

    if (selectedUnit === "FT") {
      if (!feet || !inch) {
        alert("Please enter both feet and inches");
        return;
      }
      answerValue = `${feet}ft ${inch}in`;
    } else {
      if (!cm) {
        alert("Please enter centimeters");
        return;
      }
      answerValue = `${cm}cm`;
    }

    // Save answer and go to next step
    setAnswers((prev) => ({ ...prev, [currentStep.id]: answerValue }));

    if (currentIndex < quizFlow.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Function to check if module is completed (all questions answered)
  const isModuleCompleted = (moduleNumber) => {
    const moduleSteps = questionSteps.filter((q) => q.module === moduleNumber);
    const answeredSteps = moduleSteps.filter((q) => answers[q.id]);
    return answeredSteps.length === moduleSteps.length;
  };

  // Calculate progress fill % for the line between two circles based on current module
  const getLineFillPercent = (moduleNumber) => {
    const moduleSteps = questionSteps.filter((q) => q.module === moduleNumber);
    if (moduleSteps.length === 0) return 0;
    const answeredSteps = moduleSteps.filter((q) => answers[q.id]).length;
    return (answeredSteps / moduleSteps.length) * 100;
  };

  return (
    <div className="min-h-screen bg-white px-4 py-8 flex flex-col items-center">
      {/* Progress bar */}
      <div className="flex items-center justify-center space-x-2 mb-8 w-full max-w-2xl">
        <ChevronLeft
          className="text-blue-500 cursor-pointer"
          onClick={handleBack}
          size={28}
          strokeWidth={2.5}
        />

        <div className="flex items-center flex-1">
          {[1, 2, 3, 4, 5].map((circleIndex, idx) => {
            // First circle always filled
            const isFilled =
              circleIndex === 1 ||
              (circleIndex > 1 && isModuleCompleted(circleIndex - 1));

            // Line fill for the line after current circle (except for last circle)
            const lineFill = idx < 4 ? getLineFillPercent(idx + 1) : 0;

            return (
              <div
                key={circleIndex}
                className={`flex items-center ${
                  idx < 4 ? "flex-1" : "flex-none"
                }`}
              >
                {/* Circle */}
                <div
                  className={clsx(
                    "w-6 h-6 rounded-full flex items-center justify-center z-10 transition-colors duration-300",
                    isFilled
                      ? "bg-blue-800 text-white"
                      : "bg-gray-200 text-gray-400"
                  )}
                >
                  {isFilled ? <Check color="#EFBF04" size={16} /> : ""}
                </div>

                {/* Line after circle (except last) */}
                {idx < 4 && (
                  <div className="flex-1 h-1 bg-gray-200 relative rounded-full overflow-hidden -ml-1 -mr-1">
                    <div
                      className="h-full bg-blue-500 transition-all duration-500"
                      style={{
                        width: isModuleCompleted(idx) ? `${lineFill}%` : "0%",
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <ChevronRight
          className="text-blue-500 cursor-pointer"
          onClick={handleContinue}
          size={28}
          strokeWidth={2.5}
        />
      </div>

      {/* Question Content */}
      <div className="text-center max-w-xl w-full">
        <h1 className="text-4xl font-bold mb-10 mt-3">
          {currentStep.question}
        </h1>
        {currentStep.description && (
          <p className="text-gray-500 mb-4 text-lg">
            {currentStep.description}
          </p>
        )}

        {(() => {
          switch (currentStep.type) {
            case "choice":
              return (
                <div className="space-y-4 w-full max-w-md mx-auto">
                  {currentStep.options.map((opt, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleAnswer(opt.label)}
                      className={clsx(
                        "flex items-center space-x-4 p-4 rounded-2xl cursor-pointer transition-all w-auto",
                        answers[currentStep.id] === opt.label
                          ? "bg-gradient-to-r from-blue-800 to-blue-500 text-white"
                          : "bg-gray-50 text-black hover:border-blue-500"
                      )}
                    >
                      <img
                        src={opt.image}
                        alt={opt.label}
                        className="w-11 h-11 rounded-full bg-sky-100 p-1.5"
                      />
                      <div className="text-left">
                        <span className="text-lg font-bold">{opt.label}</span>
                        {opt.description && (
                          <p className="text-sm text-gray-500">
                            {opt.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              );

            case "gender":
              return (
                <div className="flex justify-center gap-6 w-full max-w-2xl mx-auto">
                  {currentStep.options.map((opt, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleAnswer(opt.label)}
                      className={clsx(
                        "flex flex-col items-center p-4 rounded-2xl cursor-pointer transition-all w-40",
                        answers[currentStep.id] === opt.label
                          ? "bg-gradient-to-b from-blue-600 to-blue-400 text-white border-blue-600"
                          : "bg-gray-50 text-black hover:border-blue-400"
                      )}
                    >
                      <img
                        src={opt.image}
                        alt={opt.label}
                        className="h-60 w-auto object-contain mb-4"
                      />
                      <span className="text-lg font-bold">{opt.label}</span>
                    </div>
                  ))}
                </div>
              );

            case "choice-alter":
              return (
                <div className="space-y-6 w-full max-w-2xl mx-auto">
                  {currentStep.options.map((opt, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleAnswer(opt.label)}
                      className={clsx(
                        "flex items-center justify-between w-full p-4 rounded-2xl cursor-pointer transition-all",
                        answers[currentStep.id] === opt.label
                          ? "bg-gradient-to-r from-blue-800 to-blue-500 text-white"
                          : "bg-gray-50 text-black hover:border-blue-500"
                      )}
                    >
                      {/* Left Side: Label */}
                      <span className="text-lg font-bold">{opt.label}</span>

                      {/* Right Side: Image with fixed height */}
                      <div className="h-24 w-auto">
                        <img
                          src={opt.image}
                          alt={opt.label}
                          className="h-full object-contain"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              );

            case "scale":
              // Extract bolded phrase from speech (inside quotes)
              const match = currentStep.speech.match(/“(.+?)”/);
              const speechMain = match ? match[1] : currentStep.speech;
              const [highlight, ...rest] = speechMain.split(",");

              return (
                <div className="w-full max-w-xl mx-auto text-center space-y-8">
                  {/* Speech Bubble */}
                  <div className="relative inline-block max-w-full text-left">
                    <div className="bg-gradient-to-b from-white to-blue-100 text-lg leading-relaxed text-black p-6 rounded-3xl shadow-md">
                      <p>
                        {" "}
                        <span className="text-blue-600 font-bold">
                          {highlight}
                        </span>
                        {rest.length > 0 && ","}
                        <br />
                        {rest.join(",").trim()}
                      </p>
                    </div>

                    {/* Tail */}
                    <div className="absolute bottom-0 right-6 translate-y-full w-0 h-0 border-t-[20px] border-t-blue-50 border-l-[20px] border-l-transparent"></div>
                  </div>

                  {/* Scale Buttons */}
                  <div className="flex justify-center gap-4 pt-4">
                    {currentStep.scale.map((value) => (
                      <button
                        key={value}
                        onClick={() => handleAnswer(value)}
                        className={clsx(
                          "w-16 h-16 rounded-2xl text-xl font-bold flex items-center justify-center transition",
                          answers[currentStep.id] === value
                            ? "bg-gradient-to-r from-blue-800 to-blue-500 text-yellow-300"
                            : "bg-blue-50 text-black hover:bg-gray-200"
                        )}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              );

            // case "unit-input":
            case "unit-input":
              const isHeight = currentStep.question
                .toLowerCase()
                .includes("height");

              return (
                <div className="space-y-6 w-full max-w-md mx-auto text-center">
                  {/* Unit Switcher */}
                  <div className="flex justify-center gap-2 bg-gray-100 p-1 rounded-full w-full max-w-xs mx-auto">
                    {currentStep.units.map((unit) => (
                      <button
                        key={unit}
                        onClick={() => setSelectedUnit(unit)}
                        className={`w-1/2 py-2 rounded-full font-semibold ${
                          selectedUnit === unit
                            ? "bg-gradient-to-r from-blue-700 to-blue-500 text-white"
                            : "text-gray-800"
                        }`}
                      >
                        {unit}
                      </button>
                    ))}
                  </div>

                  {/* Input Fields */}
                  {isHeight && selectedUnit === "FT" ? (
                    <div className="flex justify-center items-end gap-4 text-2xl font-bold">
                      <input
                        type="number"
                        placeholder="ft"
                        value={feet}
                        onChange={(e) => setFeet(e.target.value)}
                        className="w-20 text-center border-b-2 border-black focus:outline-none"
                      />
                      <span className="text-lg">ft</span>
                      <input
                        type="number"
                        placeholder="in"
                        value={inch}
                        onChange={(e) => setInch(e.target.value)}
                        className="w-20 text-center border-b-2 border-black focus:outline-none"
                      />
                      <span className="text-lg">in</span>
                    </div>
                  ) : (
                    <div className="flex justify-center items-end gap-2 text-2xl font-bold">
                      <input
                        type="number"
                        placeholder={selectedUnit}
                        value={cm}
                        onChange={(e) => setCm(e.target.value)}
                        className="w-28 text-center border-b-2 border-black focus:outline-none"
                      />
                      <span className="text-lg">{selectedUnit}</span>
                    </div>
                  )}

                  {/* Info Box */}
                  <div className="bg-gray-100 p-4 rounded-2xl flex gap-2 items-start">
                    <span className="text-blue-600 text-xl">🧮</span>
                    <div className="text-left">
                      <p className="font-semibold">Calculating your BMI</p>
                      <p className="text-sm text-gray-600">
                        Body mass index (BMI) is a metric of body fat percentage
                        commonly used to estimate risk levels of potential
                        health problems.
                      </p>
                    </div>
                  </div>

                  {/* Done Button (moved below info) */}
                  <button
                    onClick={handleNextStep}
                    className="bg-gradient-to-r from-blue-800 to-blue-500 text-yellow-300 font-semibold py-2 px-6 rounded-full shadow-md hover:scale-105 transition w-full max-w-xs text-2xl"
                  >
                    Done
                  </button>
                </div>
              );

            case "date":
              return (
                <div className="w-full max-w-md mx-auto text-center px-4 space-y-10">
                  {/* Date Input styled with underline */}
                  <div className="border-b-2 border-gray-300">
                    <input
                      type="date"
                      value={answers[currentStep.id] || ""}
                      onChange={(e) =>
                        setAnswers((prev) => ({
                          ...prev,
                          [currentStep.id]: e.target.value,
                        }))
                      }
                      className="w-full text-center text-2xl font-semibold text-black bg-transparent py-2 outline-none"
                    />
                  </div>

                  {/* Skip link + Done button in column */}
                  <div className="flex flex-col items-center space-y-4">
                    {currentStep.optional && (
                      <button
                        onClick={() => handleContinue(true)}
                        className="text-blue-600 hover:underline text-base"
                      >
                        Skip this question
                      </button>
                    )}

                    <button
                      onClick={() => handleContinue(false)}
                      className="bg-gradient-to-r from-blue-800 to-blue-500 text-yellow-300 font-semibold py-4 px-6 rounded-full shadow-md hover:scale-105 transition w-full max-w-xs text-2xl"
                    >
                      Done
                    </button>
                  </div>
                </div>
              );

            default:
              return null;
          }
        })()}
      </div>
    </div>
  );
}
