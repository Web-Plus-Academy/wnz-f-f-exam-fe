import React, { useEffect, useState } from "react";
import logo from "/logo.png";

const Loader: React.FC = () => {
  const [count, setCount] = useState(10);
  const [message, setMessage] = useState("Setting up your exam environment...");

  useEffect(() => {
    if (count <= 0) {
      setMessage("Launching your exam...");
      return;
    }

    const timer = setTimeout(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    // Change message based on countdown
    if (count <= 10 && count >= 7) {
      setMessage("Setting up your exam environment...");
    } else if (count <= 6 && count >= 4) {
      setMessage("Configuring security checks...");
    } else if (count <= 3 && count >= 1) {
      setMessage("Finalizing login...");
    }

    return () => clearTimeout(timer);
  }, [count]);

  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 flex flex-col items-center justify-center z-50">

      {/* Spinner + Logo Wrapper */}
      <div className="relative w-28 h-28 flex items-center justify-center">

        {/* Rotating Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-orange-500 border-t-transparent animate-spin"></div>

        {/* Logo */}
        <img
          src={logo}
          alt="Saredufy Logo"
          className="w-16 h-16 object-contain"
        />

        {/* Countdown Number (center overlay optional) */}
        <div className="absolute bottom-[-35px] text-sm font-semibold text-gray-600">
          {count}s
        </div>
      </div>

      {/* Dynamic Text */}
      <p className="mt-10 text-gray-700 font-medium tracking-wide text-center px-6">
        {message}
      </p>
    </div>
  );
};

export default Loader;
