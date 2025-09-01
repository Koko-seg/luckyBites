"use client";

import React, { useEffect, useState, createContext, useContext } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { GameStatus } from "@/types/types";
import { CenteredAnimation } from "@/components/CenteredLoading";

export type RoomData = {
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

export const RoomContext = createContext<RoomDataContext | null>(null);

export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const searchParams = useSearchParams();
  const roomCode = searchParams.get("roomCode");
  const playerName = searchParams.get("playerName");
  const router = useRouter();

  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!roomCode || !playerName) {
      setErrorMessage("Өрөөний код эсвэл тоглогчийн нэр олдсонгүй.");
      setLoading(false);
      return;
    }

    const socket = getRoomSocket(); // singleton socket

    const handleRoomData = (data: RoomData) => {
      if (data.roomCode !== roomCode) return;
      setRoomData(data);
      setLoading(false);
      setErrorMessage("");

      // Game сонгогдсон бол шууд page руу redirect
      if (data.selectedGame) {
        router.push(
          `/games/${data.selectedGame}?roomCode=${roomCode}&playerName=${playerName}`
        );
      }
    };

    const handleJoinError = (payload: { message: string | object }) => {
      const { message } = payload;
      setErrorMessage(typeof message === "object" ? JSON.stringify(message) : message);
      setLoading(false);
    };

    socket.on("roomData", handleRoomData);
    socket.on("joinError", handleJoinError);

    socket.emit("joinRoom", { roomCode, playerName });

    return () => {
      socket.off("roomData", handleRoomData);
      socket.off("joinError", handleJoinError);
      // ⚠️ disconnect хийдэггүй, singleton-д хадгална
    };
  }, [roomCode, playerName, router]);

  if (loading)
    return (
      <div>
        <CenteredAnimation />
      </div>
    );

  if (errorMessage)
    return <div>Алдаа гарлаа: {errorMessage}</div>;

  return (
    <RoomContext.Provider
      value={{ socket: getRoomSocket(), roomData, playerName }}
    >
      {children}
    </RoomContext.Provider>
  );
};

// Custom hook for convenience
export const useRoom = () => useContext(RoomContext);

// --- Singleton Socket ---
let socket: Socket | null = null;

export const getRoomSocket = (): Socket => {
  if (!socket) {
    socket = io("http://localhost:4200", {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket?.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });
  }
  return socket;
};
