import React from "react";
import ExcuseSection from "../page";

const ExcuseCard = () => {
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 text-center">
      <h3 className="text-xl font-bold text-blue-800 mb-4">
        Өрөвдөлтэй шалтгаан тоглоом
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ExcuseSection />
      </div>
    </div>
  );
};

export default ExcuseCard;
