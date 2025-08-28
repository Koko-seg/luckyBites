// GameButton.tsx
"use client";

import React, { useContext } from "react";
import { RoomContext } from "@/context/roomContextTest";
import { useRouter } from "next/navigation";

interface GameProps {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
  color: string;
  textColor: string;
}

interface GameButtonProps {
  game: GameProps;
  canStart: boolean;
  selectedGame: string | null;
}

export const GameButton: React.FC<GameButtonProps> = ({
  game,
  canStart,
  selectedGame,
}) => {
  const data = useContext(RoomContext);
  const router = useRouter();

  if (!data?.roomData || !data.playerName || !data.socket) return null;

  const { roomData, playerName, socket } = data;
  const { roomCode, players } = roomData;
  const isHost = playerName === players[0];
  const isSelected = selectedGame === game.id;
  const IconComponent = game.icon;

  const handleGameSelect = () => {
    if (!isHost || !socket) return;

    socket.emit("host:select_game", { roomCode, gameType: game.id });
  };

  
  const buttonClasses = isSelected
    ? `${game.color} ${game.textColor} ring-4 ring-white ring-opacity-60`
    : `${game.color} ${game.textColor}`;


  if (!isHost) {
    return (
      <div
        className={`${buttonClasses} p-6 rounded-3xl shadow-xl border-b-4 opacity-60`}
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 p-4 bg-white/30 rounded-2xl">
            <IconComponent size={48} className="mx-auto" />
          </div>
          <h3 className="text-2xl font-black mb-2">{game.name}</h3>
          <p className="text-lg font-medium opacity-90">{game.description}</p>
          {isSelected && (
            <div className="mt-2 text-sm font-bold bg-white/50 px-3 py-1 rounded-full">
              СОНГОГДСОН
            </div>
          )}
        </div>
      </div>
    );
  }

  
  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleGameSelect}
        className={`${buttonClasses} p-6 rounded-3xl shadow-xl border-b-4 transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 ${
          !canStart ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 p-4 bg-white/30 rounded-2xl group-hover:bg-white/40 transition-colors">
            <IconComponent size={48} className="mx-auto" />
          </div>
          <h3 className="text-2xl font-black mb-2">{game.name}</h3>
          <p className="text-lg font-medium opacity-90">{game.description}</p>
          {isSelected && (
            <div className="mt-2 text-sm font-bold bg-white/50 px-3 py-1 rounded-full">
              СОНГОГДСОН
            </div>
          )}
        </div>
      </button>

      {/* Game эхлүүлэх товч зөвхөн сонгогдсон game-д */}
      {/* {isSelected && canStart && (
        <button
          onClick={handleGameStart}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:-translate-y-1 transition-all duration-200"
        >
          🚀 ТОГЛООМ ЭХЛҮҮЛЭХ
        </button>
      )} */}
    </div>
  );
};
