// GameButton.tsx

"use client";

import React, { useContext } from "react";
import { RoomContext } from "@/context/roomContextTest";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

// GameProps-ийн icon талбарыг string-ээр өргөтгөв
interface GameProps {
  id: string;
  name: string;
  description: string;
  icon:
    | React.ComponentType<{ size: number; className?: string }>
    | string
    | StaticImport;
  color: string;
  textColor: string;
}

interface GameButtonProps {
  game: GameProps;
  canStart: boolean;
  selectedGame: string | null;
}

const GameIcon = ({
  icon,
  name,
}: {
  icon: GameProps["icon"];
  name: string;
}) => {
  const isImage = typeof icon === "string";
  const IconComponent = icon as React.ComponentType<{
    size: number;
    className?: string;
  }>;

  return (
    <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center p-2 rounded-2xl group-hover:bg-white/40 transition-colors">
      {isImage ? (
        <Image
          src={icon as string | StaticImport}
          alt={name}
          width={48}
          height={48}
          className="w-full h-full object-contain"
        />
      ) : (
        <IconComponent size={48} className="w-full h-full" />
      )}
    </div>
  );
};

export const GameButton: React.FC<GameButtonProps> = ({
  game,
  canStart,
  selectedGame,
}) => {
  const data = useContext(RoomContext);

  if (!data?.roomData || !data.playerName || !data.socket) return null;

  const { roomData, playerName, socket } = data;
  const { roomCode } = roomData;

  const isHost = playerName === roomData.host;
  const isSelected = selectedGame === game.id;

  const handleGameSelect = () => {
    if (!isHost || !socket) return;
    socket.emit("host:select_game", { roomCode, gameType: game.id });
  };

  const buttonClasses = isSelected
    ? `${game.color} ${game.textColor} ring-4 ring-white ring-opacity-60`
    : `${game.color} ${game.textColor}`;

  const content = (
    <div className="flex items-center text-center">
      <div>
        <h3 className="text-2xl font-black mb-2">{game.name}</h3>
        <p className="text-lg font-medium opacity-90">{game.description}</p>
      </div>
      <div className="mb-4 p-4 bg-white/30 rounded-2xl group-hover:bg-white/40 transition-colors">
        <GameIcon icon={game.icon} name={game.name} />
      </div>
    </div>
  );

  if (!isHost) {
    return (
      <div
        className={`${buttonClasses} p-6 rounded-3xl shadow-xl border-b-4 opacity-60 `}
      >
        {content}
        {isSelected && (
          <div className="mt-2 text-sm font-bold bg-white/50 px-3 py-1 rounded-full">
            СОНГОГДСОН
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="">
      <button
        onClick={handleGameSelect}
        className={`${buttonClasses} p-6 rounded-3xl shadow-xl border-b-4 transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 ${
          !canStart ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {content}
        {isSelected && (
          <div className="mt-2 text-sm font-bold bg-white/50 px-3 py-1 rounded-full">
            СОНГОГДСОН
          </div>
        )}
      </button>
    </div>
  );
};
