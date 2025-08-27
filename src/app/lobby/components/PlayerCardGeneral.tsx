import { Users } from "lucide-react";
import { PlayerCard } from "./PlayerCard";
import { useSearchParams } from "next/navigation";
import { useContext } from "react";
import { Player } from "@/types/types";
import { RoomContext } from "../../../context/roomContextTest";

export const PlayerCardGeneral = () => {
  const searchParams = useSearchParams();

  const playerName = searchParams.get("playerName");

  const roomData = useContext(RoomContext);

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

  const handleRemovePlayer = (playerNameToRemove: string) => {
    if (!isCurrentUserHost) return;
  };

  return (
    <div className="max-w-4xl mx-auto mb-12">
      <h2 className="text-1xl font-bold text-blue-800 mb-6 text-center flex items-center justify-center gap-2">
        <Users size={24} />
        Өрөөнд байгаа тоглогчид ({roomData?.players.length}/10)
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {players.map((player, index) => (
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
          <div className="bg-white/40 backdrop-blur-sm p-4 rounded-2xl border-3 border-dashed border-blue-300 text-center flex flex-col items-center justify-center min-h-[120px]">
            <div className="w-12 h-12 bg-blue-200 rounded-full mx-auto mb-3 flex items-center justify-center text-blue-500">
              <Users size={24} />
            </div>
            <p className="text-blue-600 font-medium text-sm">
              Бусад тоглогчдыг хүлээж байна...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
