"use client";

import { IconBackground } from "@/components/IconBackground";
import { RoomContext } from "@/context/roomContextTest";
import { SquareArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import Lottie from "lottie-react";
import globeAnimation from "@/animation/Confetti.json";

const RunnerGame: React.FC = () => {
  const router = useRouter();
  const data = useContext(RoomContext);
  const { roomData, socket, playerName } = data || {};

  const [gameStarted, setGameStarted] = useState(false);
  const [playersPositions, setPlayersPositions] = useState<Record<string, number>>({});
  const [winner, setWinner] = useState<string | null>(null);

  // --- Socket listener ---
  useEffect(() => {
    if (!socket) return;

    const handlePositions = (positions: Record<string, number>) =>
      setPlayersPositions(positions);
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
    if (!roomData?.players) return;

    const initialPositions: Record<string, number> = {};
    roomData.players.forEach((p) => (initialPositions[p] = 0));
    setPlayersPositions(initialPositions);
    setWinner(null);
    setGameStarted(false);
  }, [roomData?.players]);

  const moveForward = () => {
    if (!roomData || !socket || !playerName) return;

    if (!gameStarted) setGameStarted(true);

    const currentPos = playersPositions[playerName] || 0;
    const newPos = Math.min(currentPos + 5, 100);
    const updatedPositions = { ...playersPositions, [playerName]: newPos };
    setPlayersPositions(updatedPositions);

    socket.emit("runner:update_positions", {
      roomCode: roomData.roomCode,
      positions: updatedPositions,
    });

    if (newPos >= 100) {
      setWinner(playerName);
      socket.emit("runner:finish", {
        roomCode: roomData.roomCode,
        winner: playerName,
      });
    }
  };

  const backLobby = () => {
    if (!roomData || !playerName) return;
    router.push(`/lobby?roomCode=${roomData.roomCode}&playerName=${playerName}`);
  };

  if (!socket || !roomData || !playerName) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative w-64 h-64 md:w-80 md:h-80">
          <Lottie animationData={globeAnimation} loop={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-blue-200 flex flex-col items-center">
      <IconBackground />
      <div className="flex justify-between w-full max-w-lg mb-6">
        <div className="relative p-[2px] rounded-md bg-gradient-to-br from-blue-400 via-blue-400 to-violet-400">
          <button
            className="bg-blue-300 hover:bg-blue-400 px-4 py-2 rounded-md text-white flex items-center justify-center relative z-10"
            onClick={backLobby}
          >
            <SquareArrowLeft />
          </button>
        </div>
      </div>

      {winner ? (
        <div className="text-center p-8 bg-blue-400 rounded-xl shadow-lg ">
          <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
            <Lottie animationData={globeAnimation} loop={true} />
          </div>
          <div className="text-4xl font-bold mb-4">
            🎉 {winner} 🎉
            <h1>Чи ч хурдан 🐌 юм даа!</h1>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-lg space-y-4">
          {gameStarted && (
            <h1 className="text-3xl font-bold text-center mb-4 text-blue-500">
              <span className="animate-bounce inline-block">🐌</span> Chill
              уралдаан эхэллээ
            </h1>
          )}

          {roomData.players.map((name) => {
            const progress = playersPositions[name] || 0;
            return (
              <div key={name} className="w-full bg-white rounded-full h-6 relative">
                <div
                  className={`h-6 rounded-full transition-all duration-500 ${name === playerName ? "bg-blue-500" : "bg-gray-400"
                    }`}
                  style={{ width: `${progress}%` }}
                />
                <span className="absolute left-2 top-0 text-sm font-bold z-10">{name}</span>
                <span
                  className="absolute top-1/2 -translate-y-1/2 z-20 transition-all duration-500 text-sm"
                  style={{ left: `${progress}%`, transform: "translateX(-50%)" }}
                >
                  🐌
                </span>
              </div>
            );
          })}

          <div className="fixed bottom-0 left-0 right-0 z-50 p-16 flex justify-center">
            <button
              onClick={moveForward}
              className="mt-6 bg-blue-400 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl items-center"
            >
              🐌 Гүйгээд урагшаа
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RunnerGame;
