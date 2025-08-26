import { ArrowLeft, LogOut, Users } from "lucide-react"

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import io, { Socket } from "socket.io-client";
import { Player } from "@/types/types";


interface RoomData {
  roomCode: string;
  host: string | null;
  players: string[];
  roomName:string
}
let socket: Socket;

export const RoomInfoCard = ()=> {
 const searchParams = useSearchParams();
  const roomCode = searchParams.get("roomCode");
  const playerName = searchParams.get("playerName"); // Get player's nickname from URL

  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("")

  
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
              <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 text-center">
        
           
            <div className="flex items-center gap-2 text-center">
              <h2 className="font-bold text-blue-800">Өрөөний код:</h2>
              <h2 className=" px-3 py-1  text-blue-900 font-mono text-lg font-bold">
               {roomData?.roomCode}
              </h2>
            </div>
          <div className="flex items-center justify-center gap-4 text-blue-600">
            
             <h1 className="text-1xl font-black text-blue-800 mb-2">
            Өрөөний нэр: {roomData?.roomName}
          </h1>
        
             <p className="text-xl mb-6">Хост: {roomData?.host}</p>
         
          </div>
        </div>
      </div>
    )
}