import Lottie from "lottie-react";
import globeAnimation from "@/animation/Loading Dots In Yellow.json";
import { IconBackground } from "./IconBackground";

export const CenteredAnimation = () => {
  return (
    // ✅ Энэ бол таны нэмэх ёстой гол контейнер
    <div className="flex justify-center items-center min-h-screen ">
      <IconBackground />
      {/* Өмнөх хариултанд байсан Lottie-ийн контейнер */}
      <div className="relative w-64 h-64 md:w-80 md:h-80">
        <Lottie
          animationData={globeAnimation}
          loop={true}
          className="text-purple-500"
        />
      </div>
    </div>
  );
};
