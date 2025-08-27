// app/(games)/runnerGame/page.tsx
"use client";

import { RoomContext } from "@/context/roomContextTest";
import React, { useContext, useEffect, useState } from "react";


const RunnerGame: React.FC = () => {
  const data = useContext(RoomContext);
  const { roomData, socket, playerName } = data || {};
console.log(data)
  const [gameStarted, setGameStarted] = useState(false);
  const [playersPositions, setPlayersPositions] = useState<Record<string, number>>({});
  if (!socket || !roomData || !playerName) {
    return <div>Лобби ачааллаж байна...</div>;
  }

  // Socket events
  useEffect(() => {
    if (!socket) return;

    // Тоглоом эхлэх
    const handleStart = () => {
      setGameStarted(true);

      // Анхны байрлал тохируулах
      const initialPositions: Record<string, number> = {};
      roomData.players.forEach(p => (initialPositions[p] = 0));
      setPlayersPositions(initialPositions);
    };

    // Хэрэглэгчдийн байрлал update
    const handlePositions = (positions: Record<string, number>) => {
      setPlayersPositions(positions);
    };

    socket.on("runner:start_game", handleStart);
    socket.on("runner:update_positions", handlePositions);

    return () => {
      socket.off("runner:start_game", handleStart);
      socket.off("runner:update_positions", handlePositions);
    };
  }, [socket, roomData]);

  // Host хөдөлгөх event
  const moveForward = () => {
    if (!roomData) return;
    const currentPos = playersPositions[playerName!] || 0;
    const newPos = Math.min(currentPos + 3, 100); // % хэлбэрээр
    const updatedPositions = { ...playersPositions, [playerName!]: newPos };
    setPlayersPositions(updatedPositions);

    // Сервер рүү update илгээх
    socket?.emit("runner:update_positions", { roomCode: roomData.roomCode, positions: updatedPositions });
  };

  return (
    <div className="min-h-screen p-8 bg-green-200 flex flex-col items-center">
      {!gameStarted ? (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Уралдаан эхлэх гэж байна...</h1>
          <p>Бусад тоглогчдыг хүлээнэ үү</p>
        </div>
      ) : (
        <div className="w-full max-w-lg space-y-4">
          <h1 className="text-3xl font-bold text-center mb-4">🏃‍♂️ Уралдаан эхэлсэн!</h1>
          {Object.entries(playersPositions).map(([name, pos]) => (
            <div key={name} className="w-full bg-white rounded-full h-6 relative">
              <div
                className="bg-blue-500 h-6 rounded-full transition-all"
                style={{ width: `${pos}%` }}
              />
              <span className="absolute left-2 top-0 text-sm font-bold">{name}</span>
            </div>
          ))}

          <button
            onClick={moveForward}
            className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-xl"
          >
            🏃‍♂️ Даралт хийх
          </button>
        </div>
      )}
    </div>
  );
};

export default RunnerGame;
