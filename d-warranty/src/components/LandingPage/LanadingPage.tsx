import React from "react";

import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-[#c9def4] to-[#b8a4c9]">
      <h1 className="text-3xl font-bold mb-4 text-white">
        Welcome to D-Warranty
      </h1>
      <p className="text-lg mb-4 text-white">Choose one to proceed</p>
      <div className="flex space-x-4">
        <Button
          onClick={() => navigate("/brand")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Brand
        </Button>
        <Button
          onClick={() => navigate("/customer")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Customer
        </Button>
      </div>
    </div>
  );
};

export default LandingPage;
