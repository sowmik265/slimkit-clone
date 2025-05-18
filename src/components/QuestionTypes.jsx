'use client';
import { useState } from 'react';

export const MultipleChoiceQuestion = ({ question, answer, onAnswer }) => {
  return (
    <div className="space-y-3 w-full max-w-md">
      {question.description && (
        <p className="text-gray-600 text-sm mb-4">{question.description}</p>
      )}
      {question.options.map((opt, idx) => (
        <button
          key={idx}
          onClick={() => onAnswer(opt.label)}
          className={`w-full p-4 text-left rounded-xl border-2 transition-all
            ${answer === opt.label 
              ? 'border-blue-600 bg-blue-50 shadow-sm' 
              : 'border-gray-200 hover:border-blue-400'}`}
        >
          <div className="font-medium text-gray-800">{opt.label}</div>
          {opt.description && (
            <p className="text-sm text-gray-600 mt-1">{opt.description}</p>
          )}
        </button>
      ))}
    </div>
  );
};

export const InputQuestion = ({ question, answer, onAnswer }) => {
  const [unit, setUnit] = useState(question.units?.[0] || '');
  const [value, setValue] = useState('');

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    onAnswer({ value: newValue, unit });
  };

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="flex gap-3 items-center">
        <input
          type="number"
          value={value}
          onChange={handleChange}
          className="flex-1 p-4 border-2 border-gray-200 rounded-xl"
          placeholder={question.text}
        />
        {question.units && (
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            {question.units.map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setUnit(u)}
                className={`px-4 py-2 rounded-md transition-colors
                  ${unit === u ? 'bg-white shadow-sm' : 'bg-transparent'}`}
              >
                {u}
              </button>
            ))}
          </div>
        )}
      </div>
      {question.note && (
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-sm text-blue-800">{question.note}</p>
          {question.subnote && (
            <p className="text-sm mt-2 text-blue-700">{question.subnote}</p>
          )}
        </div>
      )}
    </div>
  );
};

export const SliderQuestion = ({ question, answer, onAnswer }) => {
  return (
    <div className="w-full max-w-md space-y-6">
      <div className="flex justify-between gap-2">
        {question.scale.map((val) => (
          <button
            key={val}
            onClick={() => onAnswer(val)}
            className={`flex-1 h-12 rounded-lg flex items-center justify-center transition-colors
              ${answer === val 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            {val}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-gray-600 text-sm px-2">
        <span>Strongly Disagree</span>
        <span>Strongly Agree</span>
      </div>
    </div>
  );
};

export const DateQuestion = ({ question, answer, onAnswer }) => {
  return (
    <div className="w-full max-w-md space-y-4">
      <input
        type="date"
        value={answer || ''}
        onChange={(e) => onAnswer(e.target.value)}
        className="w-full p-4 border-2 border-gray-200 rounded-xl"
      />
      {question.allowSkip && (
        <button
          onClick={() => onAnswer('skip')}
          className="text-blue-600 hover:text-blue-700 text-sm"
        >
          Skip this question
        </button>
      )}
    </div>
  );
};