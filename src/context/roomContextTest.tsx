import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import io, { Socket } from "socket.io-client";
import { GameStatus } from "@/types/types";

type RoomData = {
  roomCode: string;
  host: string | null;
  players: string[];
  roomName: string;
  playerName: string | null;
  socket: Socket | null;
  selectedGame: string | null;
  gameStatus: GameStatus;
  currentGame: string | null;
  gametype: string | null;
}

interface RoomDataContext {
  roomData: RoomData | null,
  socket: Socket | null;
  playerName: string | null;
}
let socket: Socket;

export const RoomContext = React.createContext<RoomDataContext | null>(null);

export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const searchParams = useSearchParams();
  const roomCode = searchParams.get("roomCode");
  const playerName = searchParams.get("playerName");

  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!roomCode || !playerName) {
      setErrorMessage("Өрөөний код эсвэл тоглогчийн нэр олдсонгүй.");
      setLoading(false);
      return;
    }

    // Connect to the socket server only once when the component mounts
    socket = io("http://localhost:4200");

    // Add event listeners
    const handleRoomData = (data: RoomData) => {
      if (data.roomCode !== roomCode) return;
      setRoomData(data);
      setLoading(false);
      setErrorMessage(""); // Clear any previous errors
    };

    const handleJoinError = ({ message }: { message: any }) => {
      const errorText =
        typeof message === "object" ? JSON.stringify(message) : message;
      setErrorMessage(errorText);
      setLoading(false);
    };

    socket.on("roomData", handleRoomData);
    socket.on("joinError", handleJoinError);

    // Emit the joinRoom event
    socket.emit("joinRoom", { roomCode, playerName });

    // Clean-up function
    return () => {
      socket.off("roomData", handleRoomData);
      socket.off("joinError", handleJoinError);
      socket.disconnect();
    };
  }, [roomCode, playerName]);

  if (loading) {
    return <div>Лобби ачааллаж байна...</div>;
  }

  if (errorMessage) {
    return <div>Алдаа гарлаа: {errorMessage}</div>;
  }

  // Use a different check for player count if the room exists but has no players
  if (roomData && roomData.players.length === 0) {
    return <div>no player</div>;
  }


  return (
    <RoomContext.Provider value={{ socket, roomData, playerName }}>{children}</RoomContext.Provider>
  );
};
