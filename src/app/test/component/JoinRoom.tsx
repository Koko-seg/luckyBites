"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import io, { Socket } from "socket.io-client";

let socket: Socket;

export default function JoinRoom() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Socket холболт үүсгэх нэг удаа
    socket = io("http://localhost:4200");

    // Room data update
    socket.on("roomData", (data) => {
      console.log("Room data:", data);
      // Амжилттай join хийсэн бол lobby руу шилжих
      if (isConnecting) {
        setIsConnecting(false);
        router.push(`/lobby?roomId=${data.roomCode}&playerName=${nickname}`);
      }
    });

    // Join алдаа
    socket.on("joinError", ({ message }) => {
      setErrorMessage(message);
      setIsConnecting(false);
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err);
      setErrorMessage("Socket холболт үүсгэж чадсангүй.");
      setIsConnecting(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [router, nickname, isConnecting]);

  const handleJoinRoom = () => {
    if (!roomCode || !nickname) {
      setErrorMessage("Өрөөний код болон nickname оруулна уу.");
      return;
    }

    setErrorMessage("");
    setIsConnecting(true);

    // Өрөөнд join хийх
    socket.emit("joinRoom", { roomCode, playerName: nickname });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Өрөөнд Нэвтрэх</h1>

      <input
        type="text"
        placeholder="Өрөөний код"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
        className="mb-4 px-4 py-2 rounded border w-72 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <input
        type="text"
        placeholder="Nickname"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        className="mb-6 px-4 py-2 rounded border w-72 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <Button
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        onClick={handleJoinRoom}
        disabled={isConnecting}
      >
        {isConnecting ? "Холболт үүсгэж байна..." : "Нэвтрэх"}
      </Button>

      {errorMessage && (
        <div className="text-red-500 font-semibold mt-2">{errorMessage}</div>
      )}
    </div>
  );
}