'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import clsx from 'clsx'
import surveyScreens from '/data/survey'

const quizFlow = surveyScreens
const questionSteps = quizFlow.filter(step => step.type !== 'static')
const totalModules = Math.max(...questionSteps.map(q => q.module))

export default function QuizPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const currentStep = quizFlow[currentIndex]

  const handleAnswer = (answer) => {
    setAnswers(prev => ({ ...prev, [currentStep.id]: answer }))
    if (currentIndex < quizFlow.length - 1) {
      setCurrentIndex(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
    }
  }

  const handleContinue = () => {
    if (currentIndex < quizFlow.length - 1) {
      setCurrentIndex(prev => prev + 1)
    }
  }

  // Function to check if module is completed (all questions answered)
  const isModuleCompleted = (moduleNumber) => {
    const moduleSteps = questionSteps.filter(q => q.module === moduleNumber)
    const answeredSteps = moduleSteps.filter(q => answers[q.id])
    return answeredSteps.length === moduleSteps.length
  }

  // Calculate progress fill % for the line between two circles based on current module
  const getLineFillPercent = (moduleNumber) => {
    const moduleSteps = questionSteps.filter(q => q.module === moduleNumber)
    if (moduleSteps.length === 0) return 0
    const answeredSteps = moduleSteps.filter(q => answers[q.id]).length
    return (answeredSteps / moduleSteps.length) * 100
  }

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
            const isFilled = circleIndex === 1 || (circleIndex > 1 && isModuleCompleted(circleIndex - 1))

            // Line fill for the line after current circle (except for last circle)
            const lineFill = idx < 4 ? getLineFillPercent(idx + 1) : 0

            return (
              <div key={circleIndex} className="flex items-center flex-1">
                {/* Circle */}
                <div
                  className={clsx(
                    'w-6 h-6 rounded-full flex items-center justify-center z-10 transition-colors duration-300',
                    isFilled ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'
                  )}
                >
                  {isFilled ? <Check size={16} /> : ''}
                </div>

                {/* Line after circle (except last) */}
                {idx < 4 && (
                  <div className="flex-1 h-1 mx-1 bg-gray-200 relative rounded-full overflow-hidden">
                    {/* Only allow line fill if previous module fully completed (linear progression) */}
                    <div
                      className="h-full bg-blue-500 transition-all duration-500"
                      style={{
                        width: isModuleCompleted(idx) ? `${lineFill}%` : '0%'
                      }}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <ChevronRight
          className="text-blue-500 cursor-pointer"
          onClick={handleContinue}
        />
      </div>

      {/* Question Content */}
      <div className="text-center max-w-xl w-full">
        <h1 className="text-2xl font-bold mb-2">{currentStep.question}</h1>
        {currentStep.description && (
          <p className="text-gray-500 mb-4">{currentStep.description}</p>
        )}

        {(() => {
          switch (currentStep.type) {
            case 'choice':
              return (
                <div className="space-y-4 w-full max-w-md mx-auto">
                  {currentStep.options.map((opt, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleAnswer(opt.label)}
                      className={clsx(
                        'flex items-center space-x-4 p-4 rounded-2xl cursor-pointer border transition-all',
                        answers[currentStep.id] === opt.label
                          ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white'
                          : 'bg-gray-50 text-black hover:border-blue-500'
                      )}
                    >
                      <div>
                        <span className="text-lg font-semibold">{opt.label}</span>
                        {opt.description && (
                          <p className="text-sm text-gray-500">{opt.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )

            case 'scale':
              return (
                <div className="flex flex-wrap gap-4 justify-center w-full max-w-md mx-auto">
                  {currentStep.scale.map((value) => (
                    <button
                      key={value}
                      onClick={() => handleAnswer(value)}
                      className={clsx(
                        'w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold',
                        answers[currentStep.id] === value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      )}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              )

            case 'unit-input':
              return (
                <div className="space-y-4 w-full max-w-md mx-auto">
                  <input
                    type="text"
                    value={answers[currentStep.id] || ''}
                    onChange={(e) => setAnswers(prev => ({ ...prev, [currentStep.id]: e.target.value }))}
                    className="w-full p-4 border rounded-2xl focus:outline-blue-500"
                    placeholder={`Enter your ${currentStep.question.toLowerCase()}...`}
                  />
                  <button
                    onClick={handleContinue}
                    disabled={!answers[currentStep.id]}
                    className={clsx(
                      'w-full py-4 rounded-2xl font-semibold',
                      answers[currentStep.id]
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    )}
                  >
                    Continue
                  </button>
                </div>
              )

            case 'date':
              return (
                <div className="space-y-4 w-full max-w-md mx-auto">
                  <input
                    type="date"
                    value={answers[currentStep.id] || ''}
                    onChange={(e) => setAnswers(prev => ({ ...prev, [currentStep.id]: e.target.value }))}
                    className="w-full p-4 border rounded-2xl focus:outline-blue-500"
                  />
                  <button
                    onClick={handleContinue}
                    className="w-full py-4 rounded-2xl font-semibold bg-blue-600 text-white"
                  >
                    Continue
                  </button>
                </div>
              )

            default:
              return null
          }
        })()}
      </div>
    </div>
  )
}
