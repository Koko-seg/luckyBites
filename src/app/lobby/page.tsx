"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import io, { Socket } from "socket.io-client";
import { RoomLobby } from "./components/RoomLobby";
import { RoomProvider } from "@/context/roomContextTest";

let socket: Socket;

// interface RoomData {
//   roomCode: string;
//   host: string | null;
//   players: string[];
// }

export default function Lobby() {
  // const searchParams = useSearchParams();
  // const roomCode = searchParams.get("roomCode");
  // const playerName = searchParams.get("playerName"); // Get player's nickname from URL

  // const [roomData, setRoomData] = useState<RoomData | null>(null);
  // const [loading, setLoading] = useState(true);
  // const [errorMessage, setErrorMessage] = useState("");

  // useEffect(() => {
  //   // Check if required parameters exist
  //   if (!roomCode || !playerName) {
  //     setErrorMessage("Өрөөний код эсвэл тоглогчийн нэр олдсонгүй.");
  //     setLoading(false);
  //     return;
  //   }

  //   // Connect to the socket server
  //  socket = io("http://localhost:4200");

  //   // Listen for room data updates from the server
  //   socket.on("roomData", (data: RoomData) => {
  //     if (data.roomCode !== roomCode) return;
  //     // The line below was causing the issue and has been removed.
  //     // if (!data.players.length) return;

  //     setRoomData(data);
  //     setLoading(false);
  //   });

  //   // Listen for join errors
  //   socket.on("joinError", ({ message }) => {
  //     const errorText = typeof message === 'object' ? JSON.stringify(message) : message;
  //     setErrorMessage(errorText);
  //     setLoading(false);
  //   });

  //   // Emit the joinRoom event with the actual player name
  //   socket.emit("joinRoom", { roomCode, playerName });

  //   // Clean-up function to disconnect the socket when the component unmounts
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, [roomCode, playerName]); // Dependencies are now correct

  // if (loading) {
  //   return <div>Лобби ачааллаж байна...</div>;
  // }

  // if (errorMessage) {
  //   return <div>Алдаа гарлаа: {errorMessage}</div>;
  // }

  // if (roomData?.players?.length === 0) {
  //   return <div>no player</div>;
  // }

  return (
    <RoomProvider>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 p-4">
        {/* <h1 className="text-3xl font-bold mb-4">
        Өрөөний код: {roomData?.roomCode}
      </h1>
      <p className="text-xl mb-6">Хост: {roomData?.host}</p>

      <h2 className="text-2xl font-semibold mb-2">Тоглогчид:</h2>
      <ul className="bg-white rounded-lg shadow-md p-4 w-64 text-center">
        {roomData?.players?.map((player, index) => (
          <li key={index} className="text-lg py-1">
            {player}
          </li>
        ))}
      </ul> */}
        <RoomLobby />
      </div>
    </RoomProvider>
  );
}
