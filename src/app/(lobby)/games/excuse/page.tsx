"use client";

import type React from "react";
import { useContext, useState } from "react";
import { ExcuseBackground } from "./components/ExcuseBackground";
import { ExcuseHeader } from "./components/ExcuseHeader";
import { ExcuseForm } from "./components/ExcuseForm";
import { AnimatedDotAll } from "@/components/AnimatedDot";
import { RoomContext } from "@/context/roomContextTest";
import { useRouter } from "next/navigation";

export const ExcuseSection: React.FC = () => {
  const router = useRouter();
  const { roomData, playerName } = useContext(RoomContext) || {};
  const [submitted] = useState<boolean>(false);

  const data = useContext(RoomContext);

  console.log(data);

  if (!data?.roomData) {
    return <div>Лобби ачааллаж байна...</div>;
  }
  const backLobby = () => {
    if (!roomData || !playerName) return;
    router.push(
      `/lobby?roomCode=${roomData.roomCode}&playerName=${playerName}`
    );
  };
  return (
    <div className="min-h-screen bg-white p-2 flex flex-col items-center">
    <div className="min-h-screen  flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
      <button
        className="absolute top-4 left-4 text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg shadow-md transition-colors"
        onClick={backLobby}
      >
        Lobby
      </button>
      <ExcuseBackground />
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-xs sm:max-w-md w-full border border-purple-300">
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
          <ExcuseForm />
        )}

        <AnimatedDotAll />
      </div>
    </div>
    </div>
  );
};

export default ExcuseSection;