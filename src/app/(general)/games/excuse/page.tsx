"use client";

import type React from "react";
import { Suspense, useContext, useState } from "react";
import { ExcuseBackground } from "./components/ExcuseBackground";
import { ExcuseHeader } from "./components/ExcuseHeader";
import { ExcuseForm } from "./components/ExcuseForm";
import { AnimatedDotAll } from "@/components/AnimatedDot";
import { RoomContext } from "@/context/roomContextTest";
import Lottie from "lottie-react";
import globeAnimation from "@/animation/Loading Dots In Yellow.json";
import { IconBackground } from "@/components/IconBackground";
import { SquareArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const ExcuseSection: React.FC = () => {
  const router = useRouter();

  const [submitted, setSubmitted] = useState<boolean>(false);

  const { roomData, playerName } = useContext(RoomContext) || {};
  const data = useContext(RoomContext);

  if (!data?.roomData) {
    return (
      <div className="relative w-64 h-64 md:w-80 md:h-80">
        <Lottie
          animationData={globeAnimation}
          loop={true}
          className="absolute inset-0 text-purple-500"
        />
      </div>
    );
  }
  const backLobby = () => {
    if (!roomData || !playerName) return;

    router.push(
      `/lobby?roomCode=${roomData.roomCode}&playerName=${playerName}`
    );
  };
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen p-8 bg-violet-200 flex flex-col items-center">
        <ExcuseBackground />
        <IconBackground />
        <div className="flex justify-between w-full max-w-lg mb-6">
          <div className="relative p-[2px] rounded-md bg-gradient-to-br from-orange-400 via-blue-400 to-violet-400">
            <button
              className="bg-violet-300 hover:bg-violet-400 px-4 py-2 rounded-md text-white flex items-center justify-center relative z-10"
              onClick={backLobby}
            >
              <SquareArrowLeft />
            </button>
          </div>
        </div>
        <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-xs sm:max-w-md w-full border border-violet-300">
          <ExcuseHeader />
          <h2 className="text-lg sm:text-xl font-bold text-center mb-4 sm:mb-6 text-purple-700 drop-shadow-sm">
            Шалтаг аа бич📝 {playerName}
          </h2>

          {submitted ? (
            <div className="text-center py-6 sm:py-8">
              <p className="text-lg font-bold text-purple-600 mb-2 drop-shadow-sm">
                Шалтаг амжилттай илгээгдлээ!
              </p>
              <p className="text-purple-500">Шалтагаа бичсэнд баярлалаа кк.</p>
            </div>
          ) : (
            <ExcuseForm onSuccess={() => setSubmitted(true)} />
          )}
          <div className="flex justify-between px-6"></div>
          <AnimatedDotAll />
        </div>
      </div>
    </Suspense>
  );
};

export default ExcuseSection;
