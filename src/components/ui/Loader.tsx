import React from "react";
import logo from "/logo.png";

interface LoaderProps {
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({ text = "Logging you in..." }) => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 flex flex-col items-center justify-center z-50">

      {/* Spinner + Logo Wrapper */}
      <div className="relative w-24 h-24 flex items-center justify-center">

        {/* Rotating Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-orange-500 border-t-transparent animate-spin"></div>

        {/* Logo */}
        <img
          src={logo}  // ⚠️ In Vite/React use absolute path like this
          alt="Saredufy Logo"
          className="w-16 h-16 object-contain"
        />

      </div>

      {/* Text */}
      <p className="mt-6 text-gray-700 font-medium tracking-wide">
        {text}
      </p>
    </div>
  );
};

export default Loader;
