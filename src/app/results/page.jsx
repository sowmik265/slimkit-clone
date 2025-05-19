"use client";
import { useEffect, useState } from "react";

const plans = [
  {
    id: "year",
    label: "1-YEAR PLAN",
    priceDay: 0.19,
    priceMonth: 5.83,
    priceYear: 7.5,
    oldPrice: null,
    popular: false,
  },
  {
    id: "month",
    label: "1-MONTH PLAN",
    priceDay: 0.99,
    oldPrice: 29.99,
    oldPriceStriked: 37.48,
    popular: true,
  },
  {
    id: "quarter",
    label: "3-MONTH PLAN",
    priceDay: 0.44,
    oldPrice: 39.99,
    oldPriceStriked: 49.98,
    popular: false,
  },
];

const walkingBenefitsLeft = [
  "Reach your target weight of 132 lb",
  "Support to sustain your success",
  "More energy",
];

const walkingBenefitsRight = [
  "Better health",
  "Motivational personal health insights",
  "A happier you",
];

const customerReviews = [
  {
    name: "Joe_88",
    rating: 4.5,
    text: `This app is set up perfectly. It sends your reminders to update you on your progress. And you can set my fitness level.`,
    avatar: "/testimonial1.png",
  },
  {
    name: "K.Porterous",
    rating: 5,
    text: `This app have really helped me lose weight and I feel good about myself now. I use my walking app three times a day. Also walking helps me relax my mind.`,
    avatar: "/testimonial2.png",
  },
  {
    name: "Vincent Petroni",
    rating: 4.5,
    text: `I love getting in a pretty good walk with my music play. The app pushes you to speed up at intervals and keeps track of how I am doing. This 53 year old diabetic can use all the help he can get.`,
    avatar: "/testimonial3.jpg",
  },
];

function StarRating({ rating }) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center space-x-1 text-yellow-400">
      {[...Array(fullStars)].map((_, i) => (
        <svg
          key={"full" + i}
          className="w-5 h-5 fill-current"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.564-.955L10 0l2.946 5.955 6.564.955-4.755 4.635 1.123 6.545z" />
        </svg>
      ))}
      {halfStar && (
        <svg
          className="w-5 h-5 fill-current"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="halfGrad">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path
            fill="url(#halfGrad)"
            d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.564-.955L10 0l2.946 5.955 6.564.955-4.755 4.635 1.123 6.545z"
          />
        </svg>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <svg
          key={"empty" + i}
          className="w-5 h-5 stroke-current stroke-1 fill-transparent"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.564-.955L10 0l2.946 5.955 6.564.955-4.755 4.635 1.123 6.545z" />
        </svg>
      ))}
    </div>
  );
}

export default function ResultsPage() {
  const [timeLeft, setTimeLeft] = useState(9 * 60); // 9 minutes in seconds
  const [selectedPlan, setSelectedPlan] = useState(plans[1].id);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((time) => time - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  // Format timeLeft in MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes < 10 ? "0" + minutes : minutes}:${
    seconds < 10 ? "0" + seconds : seconds
  }`;

  return (
    <div className="min-h-screen max-w-3xl mx-auto px-4 py-12 text-center font-sans select-none">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
        YOUR 3-MONTH WEIGHT <br />
        LOSS PLAN
      </h1>

      <p className="mb-2 text-lg">
        Walking app is here to help you reach your goal and{" "}
        <a className="text-blue-800 font-bold">achieve your healthy weight</a>
      </p>

      <div className="my-8 rounded-2xl border-2 border-yellow-400 bg-yellow-50 px-6 py-4 text-left text-sm leading-relaxed max-w-md mx-auto">
        <p>Your personal plan is ready. It will expire in 9 minutes.</p>
        <p className="font-semibold mt-2 mb-1">
          Time remaining <span className="text-blue-700">{formattedTime}</span>
        </p>
        <p className="text-gray-400 italic">Scroll down to get started!</p>
      </div>

      <p className="mb-4 text-lg">
        Based on your answers and personal goals, you can reach your goal weight
        by
      </p>
      <a className="block text-blue-800 font-bold mb-12 text-lg ">
        following our plan
      </a>

      {/* Weight loss graph placeholder */}
      <div className="mx-auto mb-12 max-w-lg rounded-xl bg-blue-50 shadow">
        <img
          src="/result_chart.png"
          alt="Weight loss graph"
          className="w-full h-full object-cover rounded-xl"
        />
      </div>

      {/* Walking Benefits */}
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
        Walking Benefits:
      </h1>

      <div className="mb-12 grid grid-cols-1 sm:grid-cols-2 gap-8 text-left max-w-2xl mx-auto">
        <ul className="space-y-4 list-none text-md font-semibold">
          {walkingBenefitsLeft.map((item, i) => (
            <li key={i} className="relative pl-8">
              <span
                className="font-bold absolute left-0 top-1.5 w-3 h-3 rounded-full bg-gradient-to-r from-blue-800 to-blue-500"
                aria-hidden="true"
              ></span>
              {item}
            </li>
          ))}
        </ul>
        <ul className="space-y-4 list-none text-md font-semibold">
          {walkingBenefitsRight.map((item, i) => (
            <li key={i} className="relative pl-8">
              <span
                className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-gradient-to-r from-blue-800 to-blue-500"
                aria-hidden="true"
              ></span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Plan selection */}
      <div className="mb-12 rounded-xl border border-gray-200 max-w-xl mx-auto p-6 text-left shadow-sm">
        <h2 className="text-3xl sm:text-4xl font-bold mb-10 leading-tight text-center">
          Choose your plan
        </h2>
        <form>
          {plans.map((plan) => (
            <label
              key={plan.id}
              htmlFor={`plan-${plan.id}`}
              className={`flex items-center justify-between border-2 rounded-2xl px-4 py-3 mb-4 cursor-pointer transition
          ${
            selectedPlan === plan.id
              ? " bg-gradient-to-r from-blue-800 to-blue-500 text-white border-yellow-400"
              : "bg-white text-black border-gray-300 hover:border-blue-500"
          }
        `}
            >
              {/* Custom radio circle */}
              <div className="flex items-center space-x-4">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition
              ${
                selectedPlan === plan.id
                  ? "border-yellow-400"
                  : "border-gray-400"
              }
            `}
                >
                  {selectedPlan === plan.id && (
                    <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                  )}
                </div>

                {/* Plan text info */}
                <div>
                  <div
                    className={`flex flex-col items-center space-x-2 font-bold text-sm mb-1
                ${selectedPlan === plan.id ? "text-white" : "text-black"}
              `}
                  >
                    {plan.popular && (
                      <span className="bg-yellow-400 text-black px-2 py-0.5 rounded-sm text-xs font-bold">
                        MOST POPULAR
                      </span>
                    )}
                    <span className="text-lg">{plan.label}</span>
                  </div>
                  {plan.priceYear && (
                    <div
                      className={`text-sm opacity-90
                  ${selectedPlan === plan.id ? "text-white" : "text-gray-900"}
                `}
                    >
                      ${plan.priceYear}{" "}
                      {plan.priceMonth ? `(${plan.priceMonth} monthly)` : ""}
                    </div>
                  )}
                  {plan.oldPrice && (
                    <div
                      className={`text-xs line-through opacity-90
                  ${
                    selectedPlan === plan.id ? "text-white/80" : "text-gray-500"
                  }
                `}
                    >
                      ${plan.oldPriceStriked ?? plan.oldPrice}
                    </div>
                  )}
                </div>
              </div>

              {/* Price */}
              <div
                className={`flex flex-col text-left font-bold text-4xl min-w-[80px]
            ${selectedPlan === plan.id ? "text-white" : "text-gray-600"}
          `}
              >
                <span>
                  <span
                    className={`text-lg align-text-top mr-1
                ${selectedPlan === plan.id ? "text-white" : "text-gray-600"}
              `}
                  >
                    $
                  </span>
                  {plan.priceDay.toFixed(2)}
                </span>

                <span
                  className={`text-base font-semibold ml-1 text-right
              ${selectedPlan === plan.id ? "text-white" : "text-gray-400"}
            `}
                >
                  per day
                </span>
              </div>

              {/* Hidden radio input */}
              <input
                type="radio"
                name="plan"
                id={`plan-${plan.id}`}
                value={plan.id}
                className="hidden"
                checked={selectedPlan === plan.id}
                onChange={() => setSelectedPlan(plan.id)}
              />
            </label>
          ))}

          <button
            type="button"
            className="mt-4 w-full bg-gradient-to-r text-2xl from-blue-800 to-blue-500 text-yellow-400 font-bold py-3 rounded-full shadow-md hover:scale-105 transition"
            onClick={() => alert(`You selected the ${selectedPlan} plan!`)}
          >
            Get my plan
          </button>

          {/* Terms and Conditions text */}
          <p className="mt-4 w-full font-semibold text-sm text-gray-500 mx-auto text-center opacity-60">
            By clicking the Get my plan, you agree to our{" "}
            <span className="underline hover:cursor-pointer">
              Terms and Conditions
            </span>{" "}
            and{" "}
            <span className="underline hover:cursor-pointer">
              Privacy Policy
            </span>
            , authorize automatic renewal of your subscription at the end of
            each 1 month billing cycle at the full price of $29.99 plus
            applicable taxes. You may cancel automatic renewal of your
            subscription anytime before the renewal date. Check our{" "}
            <span className="underline hover:cursor-pointer">
              Cancellation Policy
            </span>{" "}
            for more details.
          </p>
        </form>
      </div>

      {/* Support Section */}
      <div className="mb-12 border border-gray-100 rounded-lg bg-gray-50 py-6 px-8 text-centertext-gray-800 flex flex-col items-center">
        <p className="text-lg font-bold">Got a question?</p>
        <p className="text-lg">
          Just write to us at{" "}
          <a
            href="support@demo.com"
            className="text-blue-700 underline hover:text-blue-900"
          >
            support@demo.com
          </a>
        </p>
      </div>

      {/* Customer Reviews */}
      <section className="mb-12 text-left max-w-lg mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold mb-10 leading-tight text-center">
          Customer Reviews
        </h2>
        <div className="space-y-6">
          {customerReviews.map(({ avatar, name, rating, text }, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 p-4 flex items-start space-x-4 shadow-lg"
            >
              <img
                src={avatar}
                alt={name}
                className="w-16 h-16 rounded-full object-cover border border-yellow-400 p-1"
                loading="lazy"
              />
              <div className="flex-grow">
                <div className="flex items-center justify-between mb-1">
                  <StarRating rating={rating} />
                  <span className="text-sm font-semibold text-black">
                    {rating} / 5.0
                  </span>
                </div>
                <p className="text-gray-700 text-sm font-bold">{text}</p>
                <p className="mt-3 text-sm font-bold text-gray-600">{name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-400 mb-6 px-4 select-text">
        {/* <p className="mb-1">
          Spyrou Kyprianou, 78, MAGNUM BUSINESS CENTER, 3rd floor, 3076,
          Limassol, Cyprus. Registration number: HE 41334. VAT Number:
          CY1041334H
        </p>
        <p>
          If you still have questions just write to us at{" "}
          <a
            href="mailto:support@slimkit.health"
            className="text-blue-700 underline hover:text-blue-900"
          >
            support@slimkit.health
          </a>
        </p> */}
      </footer>
    </div>
  );
}
