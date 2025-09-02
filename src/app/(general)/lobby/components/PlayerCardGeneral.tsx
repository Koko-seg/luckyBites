"use client";

import { Users } from "lucide-react";
import { PlayerCard } from "./PlayerCard";
import { useSearchParams } from "next/navigation";
import { useContext } from "react";
import { Player } from "@/types/types";
import { RoomContext } from "../../../../context/roomContextTest";

export const PlayerCardGeneral = () => {
  const searchParams = useSearchParams();

  const playerName = searchParams.get("playerName");

  const data = useContext(RoomContext);
  const { roomData } = data || {};
  const players: Player[] =
    roomData?.players?.map((name, index) => ({
      id: index,
      name,
      roomId: 0,
      createdAt: new Date().toISOString(),
      isHost: roomData?.host === name,
      results: [],
      reasons: [],
    })) || [];

  const currentUserNickname = playerName;

  const isCurrentUserHost = roomData?.host === currentUserNickname;

  const isHost = (name: string) => roomData?.host === name;

  const handleRemovePlayer = () => {
    if (!isCurrentUserHost) return;
  };

  return (
    <div className="max-w-full mx-auto mb-4 p-4">
      <h2 className="text-base font-bold text-purple-700 mb-4 text-center flex items-center justify-center gap-2">
        <Users size={20} />
        Өрөөнд байгаа тоглогчид ({roomData?.players.length}/10)
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {players.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            isCurrentUser={player.name === currentUserNickname}
            isHost={isHost(player.name)}
            isCurrentUserHost={isCurrentUserHost}
            onRemove={handleRemovePlayer}
          />
        ))}

        {players.length < 6 && (
          <div className="flex flex-col items-center justify-center bg-white/40 backdrop-blur-sm p-4 rounded-2xl border-3 border-dashed border-purple-300 text-center text-purple-500">
            <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center text-purple-500 mb-2">
              <Users size={20} />
            </div>
            <p className="text-xs font-medium">
              Бусад тоглогчдыг хүлээж байна...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
