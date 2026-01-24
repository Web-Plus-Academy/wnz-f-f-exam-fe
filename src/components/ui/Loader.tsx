import React from "react";

interface LoaderProps {
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({ text = "Logging you in..." }) => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 flex flex-col items-center justify-center z-50">
      
      {/* Logo */}
      <img
        src="./public/favicon.ico"   // adjust path if needed
        alt="Saredufy Logo"
        className="w-20 h-20 mb-6 animate-pulse"
      />

      {/* Spinner */}
      <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>

      {/* Text */}
      <p className="mt-4 text-gray-700 font-medium">{text}</p>
    </div>
  );
};

export default Loader;
