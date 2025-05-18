"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function StartPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => router.push("/consent"), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex flex-col justify-center items-center px-4 text-center"
      style={{
        backgroundImage: "url('/1.png')",
      }}
    >
      {/* Content Container */}
      <div className="flex flex-col items-center space-y-4 w-full max-w-3xl">
        <h2 className="text-white font-bold tracking-wide mt-24 text-xl sm:text-2xl">
          New you in 12 weeks
        </h2>

        <h1 className="font-bold leading-tight text-white text-[clamp(1.10rem,4vw,2.50rem)] px-2">
          Discover how quickly you can
          <br />
          reach your weight loss goals
          <br />
          through Walking
        </h1>

        {/* Loading Text and Spinner */}
        <div className="flex items-center space-x-3 mt-6">
          <span className="text-white text-sm sm:text-base">
            Loading the quiz
          </span>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>

        {/* Progress Bar with % inside */}
        <div className="relative w-full max-w-[450px] h-8 bg-black/20 rounded-full overflow-hidden mt-3 p-1 backdrop-blur-xs">
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-100 rounded-full"
            style={{ width: `${progress}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-white text-sm font-semibold">
            {progress}%
          </div>
        </div>
      </div>

      {/* Footer Text */}
      <p className="text-md font-medium text-white/70 mt-6 text-center px-4 max-w-xl">
        Results vary depending on your starting point, goals and effort.
      </p>
    </div>
  );
}
