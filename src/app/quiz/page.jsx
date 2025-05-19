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

  const handleContinue = () => {
    if (currentIndex < quizFlow.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleNextStep = () => {
    // Add validation logic first
    if (selectedUnit === "FT") {
      if (!feet || !inch) {
        alert("Please enter both feet and inches");
        return;
      }
    } else {
      if (!cm) {
        alert("Please enter centimeters");
        return;
      }
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
      <div className="flex items-center justify-center space-x-2 mb-8 w-full max-w-4xl">
        <ChevronLeft
          className="text-blue-500 cursor-pointer"
          onClick={handleBack}
        />

        <div className="flex items-center flex-1">
          {[1, 2, 3, 4, 5].map((circleIndex, idx) => {
            // circleIndex 1 to 5, corresponds to 5 circles
            // Between circles lines correspond to modules 1 to 4

            // First circle always filled
            const isFilled =
              circleIndex === 1 ||
              (circleIndex > 1 && isModuleCompleted(circleIndex - 1));

            // Line fill for the line after current circle (except for last circle)
            const lineFill = idx < 4 ? getLineFillPercent(idx + 1) : 0;

            return (
              <div key={circleIndex} className="flex items-center flex-1">
                {/* Circle */}
                <div
                  className={clsx(
                    "w-6 h-6 rounded-full flex items-center justify-center z-10 transition-colors duration-300",
                    isFilled
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-400"
                  )}
                >
                  {isFilled ? <Check size={16} /> : ""}
                </div>

                {/* Line after circle (except last) */}
                {idx < 4 && (
                  <div className="flex-1 h-1 mx-1 bg-gray-200 relative rounded-full overflow-hidden">
                    {/* Only allow line fill if previous module fully completed (linear progression) */}
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
              return (
                <div className="flex flex-wrap gap-4 justify-center w-full max-w-md mx-auto">
                  {currentStep.scale.map((value) => (
                    <button
                      key={value}
                      onClick={() => handleAnswer(value)}
                      className={clsx(
                        "w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold",
                        answers[currentStep.id] === value
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      )}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              );

            // case "unit-input":
            case "unit-input":
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
                  {selectedUnit === "FT" ? (
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
                        placeholder="cm"
                        value={cm}
                        onChange={(e) => setCm(e.target.value)}
                        className="w-28 text-center border-b-2 border-black focus:outline-none"
                      />
                      <span className="text-lg">cm</span>
                    </div>
                  )}

                  {/* Done Button */}
                  <button
                    onClick={handleNextStep}
                    className="bg-gradient-to-r from-blue-800 to-blue-500 text-yellow-300 font-semibold py-2 px-6 rounded-full shadow-md hover:scale-105 transition w-full max-w-xs text-2xl"
                  >
                    Done
                  </button>

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
                </div>
              );

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
                  {selectedUnit === "FT" ? (
                    <div className="flex justify-center gap-6 text-2xl font-bold items-end">
                      <div>
                        <input
                          type="number"
                          value={feet}
                          onChange={(e) => setFeet(e.target.value)}
                          className="w-16 text-center border-b-2 border-black focus:outline-none"
                        />
                        <div className="text-sm mt-1">ft</div>
                      </div>
                      <div>
                        <input
                          type="number"
                          value={inch}
                          onChange={(e) => setInch(e.target.value)}
                          className="w-16 text-center border-b-2 border-black focus:outline-none"
                        />
                        <div className="text-sm mt-1">in</div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-center text-2xl font-bold items-end">
                      <div>
                        <input
                          type="number"
                          value={cm}
                          onChange={(e) => setCm(e.target.value)}
                          className="w-28 text-center border-b-2 border-black focus:outline-none"
                        />
                        <div className="text-sm mt-1">cm</div>
                      </div>
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
                </div>
              );

            case "date":
              return (
                <div className="space-y-4 w-full max-w-md mx-auto">
                  <input
                    type="date"
                    value={answers[currentStep.id] || ""}
                    onChange={(e) =>
                      setAnswers((prev) => ({
                        ...prev,
                        [currentStep.id]: e.target.value,
                      }))
                    }
                    className="w-full p-4 border rounded-2xl focus:outline-blue-500"
                  />
                  <button
                    onClick={handleContinue}
                    className="w-full py-4 rounded-2xl font-semibold bg-blue-600 text-white"
                  >
                    Continue
                  </button>
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
