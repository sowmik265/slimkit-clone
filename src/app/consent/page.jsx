"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ConsentPage() {
  const router = useRouter();

  const handleContinue = () => {
    router.push("/quiz");
  };

  return (
    <div className="h-screen w-full bg-white flex flex-col justify-center items-center px-6 text-center mt-5">
      <h1 className="text-2xl font-semibold mb-4">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-500 text-6xl font-bold">
          27 million
        </span>
        <br />
        <span className="text-[17px] font-semibold">
          users have chosen Walking by Slimkit
        </span>
      </h1>

      {/* Image */}

      <img src="/2.png" alt="Walking by Slimkit" className="w-48 h-auto mb-6" />

      {/* Consent Text */}
      <p className="text-xs text-gray-600 max-w-md mb-6">
        By pressing Continue I hereby agree to processing of my personal data.
        Nothing is shared without my permission.{" "}
        <span className=" underline hover:cursor-pointer">Privacy Policy</span>{" "}
        and{" "}
        <span className=" underline hover:cursor-pointer">
          Terms and Conditions
        </span>{" "}
        apply.
      </p>

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        className="bg-gradient-to-r from-blue-800 to-blue-500 text-yellow-300 font-semibold py-2 px-6 rounded-full shadow-md hover:scale-105 transition w-full max-w-xs text-2xl"
      >
        Continue
      </button>
    </div>
  );
}
