"use client";

import { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import { ExcuseBackground } from "@/components/excuseBackground";
import { IconBackground } from "@/components/IconBackground";

interface AutoJoinResponse {
  code: string;
  players: { id: string; name: string }[];
}

let socket: Socket;

export default function JoinRoom() {
  const [roomCode, setRoomCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    socket = io("http://localhost:4200");

    socket.on("roomData", (data: { roomCode: string }) => {
      setIsConnecting(false);
      window.location.href = `/lobby?roomCode=${data.roomCode}&playerName=${nickname}`;
    });

    socket.on("joinError", ({ message }: { message: string }) => {
      setErrorMessage(message);
      setIsConnecting(false);
    });

    socket.on("connect_error", (err: Error) => {
      console.error("Connection error:", err);
      setErrorMessage("Socket холболт үүсгэж чадсангүй.");
      setIsConnecting(false);
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, [nickname]);

  const handleJoinRoom = () => {
    if (!roomCode || !nickname) {
      setErrorMessage("Өрөөний код болон nickname оруулна уу.");
      return;
    }

    setErrorMessage("");
    setIsConnecting(true);

    socket.emit("joinRoom", { roomCode, playerName: nickname });
    socket.emit("autoJoin", { nickname }, (res: AutoJoinResponse) => {
      setRoomCode(res.code);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-200 to-orange-200 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
      <ExcuseBackground />
      <IconBackground />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleJoinRoom();
        }}
        className="bg-white p-8 w-full max-w-md rounded-xl shadow-lg relative z-10"
      >
        <div className="items-center text-center mb-8">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-7xl font-black text-violet-600  mb-2 sm:mb-4 drop-shadow-md transform -rotate-2">
            Өрөөнд
          </h1>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-7xl font-black text-yellow-400 mb-2 drop-shadow-md transform rotate-1 animate-pulse">
            Нэвтрэх
          </h1>
          <div className="w-60 sm:w-60 h-1 sm:h-1.5 bg-yellow-300 mx-auto rounded-full "></div>
        </div>

        <input
          type="text"
          placeholder="Өрөөний код"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
        />

        <input
          type="text"
          placeholder="Өөрийн нэр"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
        />

        <button
          type="submit"
          disabled={isConnecting}
          className="w-full py-2 px-4 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition-colors mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isConnecting ? "Холболт үүсгэж байна..." : "Өрөөнд нэвтрэх"}
        </button>

        {errorMessage && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mt-4"
            role="alert"
          >
            <strong className="font-bold">Алдаа гарлаа! </strong>
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}
      </form>
    </div>
  );
}
