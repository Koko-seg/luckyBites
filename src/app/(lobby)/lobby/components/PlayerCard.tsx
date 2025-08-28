"use client";

import React from "react";

import { X } from "lucide-react";
import { PlayerCardProps } from "@/types/types";


export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  isCurrentUser,
  isHost,
  isCurrentUserHost,
  onRemove,
}) => {
  return (
    <div
      className={`bg-white/80 backdrop-blur-sm p-3 sm:p-4 rounded-2xl shadow-md border-2 w-full sm:w-44 ${
        isCurrentUser
          ? "border-purple-400 bg-purple-50/80"
          : isHost
          ? "border-yellow-400 bg-yellow-50/80"
          : "border-white/50"
      } text-center transform hover:scale-105 transition-all duration-200 relative`}
    >
      <div className="">
        {isCurrentUserHost && !isHost && !isCurrentUser && (
          <button
            onClick={() => onRemove && onRemove(player.name)}
            className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
            title="Remove player"
          >
            <X size={14} />
          </button>
        )}

        <div
          className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${
            isHost
              ? "from-yellow-300 to-yellow-400"
              : isCurrentUser
              ? "from-purple-300 to-purple-400"
              : "from-gray-300 to-pruple-400"
          } rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-black ${
            isHost
              ? "text-yellow-800"
              : isCurrentUser
              ? "text-purple-800"
              : "text-purple-600"
          } shadow-inner`}
        >
          {player.name.charAt(0).toUpperCase()}
        </div>
      </div>

      <p className="font-bold text-purple-800 text-lg">{player.name}</p>

      <div className="flex flex-col gap-1 mt-2">
        {isHost && (
          <span className="inline-block px-2 py-1 bg-yellow-200 text-yellow-800 text-xs font-bold rounded-full">
            👑 Босс
          </span>
        )}
        {isCurrentUser && (
          <span className="inline-block px-2 py-1 bg-purple-200 text-purple-700 text-xs font-bold rounded-full">
            Та
          </span>
        )}
      </div>
    </div>
  );
};