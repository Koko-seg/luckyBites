import { ArrowLeft, LogOut, Users } from "lucide-react"
import { PlayerCard } from "./PlayerCard"
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import io, { Socket } from "socket.io-client";
import { Player } from "@/types/types";
import { PlayerCardGeneral } from "./PlayerCardGeneral";
import { RoomInfoCard } from "./RoomInfoCard";

interface RoomData {
  roomCode: string;
  host: string | null;
  players: string[];
  roomName:string
}
let socket: Socket;
export const RoomLobby =()=> {

    const searchParams = useSearchParams();
  const roomCode = searchParams.get("roomCode");
  const playerName = searchParams.get("playerName"); // Get player's nickname from URL

  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");



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


    return <div className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-blue-70 p-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button
            // onClick={onBack}
            className="flex items-center gap-2 text-blue-700 hover:text-blue-800 font-medium transition-colors bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm"
          >
            <ArrowLeft size={20} />
            Нүүр хуудас
          </button>
          <button
            // onClick={handleLeaveRoom}
            className="flex items-center gap-2 text-red-700 hover:text-red-800 font-medium transition-colors bg-red-100/50 hover:bg-red-100/80 px-4 py-2 rounded-full backdrop-blur-sm border border-red-200"
          >
            <LogOut size={20} />
            Өрөөнөөс гарах
          </button>
        </div>
        <div className="w-24" />
      </div>
 

<RoomInfoCard/>

      <PlayerCardGeneral/>

      <div className="text-center mb-8">
       

        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {games.map((game) => (
            <GameButton
              key={game.id}
              game={game}
              isHost={isCurrentUserHost}
              canStart={players.length >= 2}
              socket={socket}
              selectedGame={selectedGame}
              roomCode={room.code}
            />
          ))}
        </div> */}
      </div>

      {/* {players.length < 2 && (
        <div className="mt-8 text-center">
          <div className="inline-block bg-yellow-100 border-2 border-yellow-300 rounded-2xl p-4">
            <p className="text-yellow-800 font-bold">
              🎯 Тоглоом эхлэхэд 2-оос дээш тоглогч шаардлагатай!
            </p>
            <p className="text-yellow-700 text-sm mt-1">
              Share the room code{" "}
              <span className="font-black">{room.code}</span> with your friends
            </p>
          </div>
        </div>
      )} */}

      <div className="mt-12 flex justify-center space-x-6">
        {["red", "yellow", "purple"].map((color, idx) => (
          <div
            key={idx}
            className={`w-6 h-6 bg-${color}-400 rounded-full animate-bounce opacity-60`}
            style={{ animationDelay: `${idx * 0.2}s` }}
          ></div>
        ))}
      </div>
    </div>
}