"use client";

import { RoomContext } from "@/context/roomContextTest";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

const RunnerGame: React.FC = () => {
  const router = useRouter();
  const data = useContext(RoomContext);
  const { roomData, socket, playerName } = data || {};

  const [gameStarted, setGameStarted] = useState(false);
  const [playersPositions, setPlayersPositions] = useState<Record<string, number>>({});
  const [winner, setWinner] = useState<string | null>(null);

  if (!socket || !roomData || !playerName) {
    return <div>Лобби ачааллаж байна...</div>;
  }

  // --- Socket listener ---
  useEffect(() => {
    if (!socket) return;

    const handlePositions = (positions: Record<string, number>) => setPlayersPositions(positions);
    const handleFinish = ({ winner }: { winner: string }) => {
      setWinner(winner);
      setGameStarted(false);
    };

    socket.on("runner:update_positions", handlePositions);
    socket.on("runner:finish", handleFinish);

    return () => {
      socket.off("runner:update_positions", handlePositions);
      socket.off("runner:finish", handleFinish);
    };
  }, [socket]);

  // --- Initialize positions on roomData change ---
  useEffect(() => {
    const initialPositions: Record<string, number> = {};
    roomData.players.forEach(p => (initialPositions[p] = 0));
    setPlayersPositions(initialPositions);
    setWinner(null);
    setGameStarted(false);
  }, [roomData.players]);

  // --- Move forward ---
  const moveForward = () => {
    if (!gameStarted) setGameStarted(true);

    const currentPos = playersPositions[playerName!] || 0;
    const newPos = Math.min(currentPos + 5, 100);
    const updatedPositions = { ...playersPositions, [playerName!]: newPos };
    setPlayersPositions(updatedPositions);

    socket.emit("runner:update_positions", { roomCode: roomData.roomCode, positions: updatedPositions });

    if (newPos >= 100) {
      setWinner(playerName);
      socket.emit("runner:finish", { roomCode: roomData.roomCode, winner: playerName });
    }
  };

  const backLobby = () => {
    router.push(`/lobby?roomCode=${roomData.roomCode}&playerName=${playerName}`);
  };

  return (
    <div className="min-h-screen p-8 bg-green-200 flex flex-col items-center">
      <div className="flex justify-between w-full max-w-lg mb-6">
        <button onClick={backLobby} className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded">
          Lobby
        </button>
      </div>

      {winner ? (
        <div className="text-center p-8 bg-yellow-100 rounded-xl shadow-lg">
          <h1 className="text-4xl font-bold mb-4">🎉 {winner} яллаа!</h1>
        </div>
      ) : (
        <div className="w-full max-w-lg space-y-4">
          {gameStarted && (
            <h1 className="text-3xl font-bold text-center mb-4">🏃‍♂️ Уралдаан эхэлсэн!</h1>
          )}

          {/* roomData.players ашиглан map */}
          {roomData.players.map((name) => {
            const progress = playersPositions[name] || 0;
            return (
              <div key={name} className="w-full bg-white rounded-full h-6 relative">
                <div
                  className={`h-6 rounded-full transition-all duration-500 ${
                    name === playerName ? "bg-blue-500" : "bg-gray-400"
                  }`}
                  style={{ width: `${progress}%` }}
                />
                <span className="absolute left-2 top-0 text-sm font-bold">{name}</span>
              </div>
            );
          })}

          <button
            onClick={moveForward}
            className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-xl"
          >
            🏃‍♂️ Гүйгээд урагшаа
          </button>
        </div>
      )}
    </div>
  );
};

export default RunnerGame;
