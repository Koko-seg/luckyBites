"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import io, { Socket } from "socket.io-client";
import { GameStatus } from "@/types/types";

type RoomData = {
  roomCode: string;
  host: string | null;
  players: string[];
  roomName?: string;
  selectedGame: string | null;
  gameStatus?: GameStatus;
  currentGame: string | null;
  gameType: string | null;
};

interface RoomDataContext {
  roomData: RoomData | null;
  socket: Socket | null;
  playerName: string | null;
}

export const RoomContext = React.createContext<RoomDataContext | null>(null);

export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const searchParams = useSearchParams();
  const roomCode = searchParams.get("roomCode");
  const playerName = searchParams.get("playerName");
  const router = useRouter();

  const socketRef = useRef<Socket | null>(null);

  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!roomCode || !playerName) {
      setErrorMessage("Өрөөний код эсвэл тоглогчийн нэр олдсонгүй.");
      setLoading(false);
      return;
    }

    if (!socketRef.current) {
      socketRef.current = io("http://localhost:4200");
    }
    const socket = socketRef.current;

    // Room data update
    const handleRoomData = (data: RoomData) => {
      if (data.roomCode !== roomCode) return;
      setRoomData(data);
      setLoading(false);
      setErrorMessage("");

      // Redirect logic: хэрэв тоглоом сонгогдсон бол шууд game page рүү оруулах
      if (data.selectedGame) {
        router.push(`/games/${data.selectedGame}?roomCode=${roomCode}&nickname=${playerName}`);
      }
    };

    // Error
    const handleJoinError = ({ message }: { message: any }) => {
      setErrorMessage(typeof message === "object" ? JSON.stringify(message) : message);
      setLoading(false);
    };

    socket.on("roomData", handleRoomData);
    socket.on("joinError", handleJoinError);

    // Join room
    socket.emit("joinRoom", { roomCode, playerName });

    // Cleanup
    return () => {
      socket.off("roomData", handleRoomData);
      socket.off("joinError", handleJoinError);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [roomCode, playerName, router]);

  if (loading) return <div>Лобби ачааллаж байна...</div>;
  if (errorMessage) return <div>Алдаа гарлаа: {errorMessage}</div>;
  if (roomData && roomData.players.length === 0) return <div>no player</div>;
  if (!socketRef.current) return <div>Socket холболт үүссэнгүй.</div>;
  return (
    <RoomContext.Provider value={{ socket: socketRef.current, roomData, playerName }}>
      {children}
    </RoomContext.Provider>
  );
};
