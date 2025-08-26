import { Users } from "lucide-react"
import { PlayerCard } from "./PlayerCard"
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Player } from "@/types/types";
import io, { Socket } from "socket.io-client";

interface RoomData {
  roomCode: string;
  host: string | null;
  players: string[];
  roomName:string
}

let socket: Socket;

export const PlayerCardGeneral = ()=> {
     const searchParams = useSearchParams();
      const roomCode = searchParams.get("roomCode");
      const playerName = searchParams.get("playerName"); // Get player's nickname from URL
    
      const [roomData, setRoomData] = useState<RoomData | null>(null);
      const [loading, setLoading] = useState(true);
      const [errorMessage, setErrorMessage] = useState("");
    
    
    const players: Player[] = roomData?.players?.map((name, index) => ({
      id: index,
      name,
      roomId: 0, // Та серверээс `roomId` ирүүлж байгаа бол ашиглана, эсвэл түр 0
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
        socket.emit("removePlayer", { roomCode, playerName: playerNameToRemove });
      };

      useEffect(() => {
    // Check if required parameters exist
    if (!roomCode || !playerName) {
      setErrorMessage("Өрөөний код эсвэл тоглогчийн нэр олдсонгүй.");
      setLoading(false);
      return;
    }

    // Connect to the socket server
   socket = io("http://localhost:4200");

    // Listen for room data updates from the server
    socket.on("roomData", (data: RoomData) => {
      if (data.roomCode !== roomCode) return;
      // The line below was causing the issue and has been removed.
      // if (!data.players.length) return; 

      setRoomData(data);
      setLoading(false);
    });

    // Listen for join errors
    socket.on("joinError", ({ message }) => {
      const errorText = typeof message === 'object' ? JSON.stringify(message) : message;
      setErrorMessage(errorText);
      setLoading(false);
    });

    // Emit the joinRoom event with the actual player name
    socket.emit("joinRoom", { roomCode, playerName });

    // Clean-up function to disconnect the socket when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, [roomCode, playerName]); // Dependencies are now correct

  if (loading) {
    return <div>Лобби ачааллаж байна...</div>;
  }

  if (errorMessage) {
    return <div>Алдаа гарлаа: {errorMessage}</div>;
  }

  if (roomData?.players?.length === 0) {
    return <div>no player</div>;
  }
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
    )
}