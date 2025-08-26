"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import io, { Socket } from "socket.io-client";

let socket: Socket;

export default function Lobby() {
  const searchParams = useSearchParams();
  const roomCode = searchParams.get("roomId") || "";
  const playerName = searchParams.get("playerName") || "";

  const [players, setPlayers] = useState<string[]>([]);
  const [host, setHost] = useState<string | null>(null);

  useEffect(() => {
    socket = io("http://localhost:4200");

    // Өрөөнд join хийх
    socket.emit("joinRoom", { roomCode, playerName });

    // Room data update
    socket.on("roomData", (data: { host: string | null; players: string[] }) => {
      setHost(data.host);
      setPlayers(data.players);
    });

    // Join алдаа
    socket.on("joinError", ({ message }: { message: string }) => {
      alert(message);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomCode, playerName]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Lobby - Room {roomCode}</h1>
      <h2 className="text-xl mb-4">Host: {host}</h2>
      <ul className="space-y-2 w-72">
        {players.map((p) => (
          <li
            key={p}
            className={`px-4 py-2 rounded border ${
              p === host ? "bg-yellow-200 font-bold" : "bg-white"
            }`}
          >
            {p} {p === host && "(Host)"}
          </li>
        ))}
      </ul>
    </div>
  );
}