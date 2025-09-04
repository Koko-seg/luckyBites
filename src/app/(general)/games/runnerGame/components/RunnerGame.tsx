"use client";

import { IconBackground } from "@/components/IconBackground";
import { RoomContext } from "@/context/roomContextTest";
import { SquareArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useRef, useState } from "react";
import Lottie from "lottie-react";
import globeAnimation from "@/animation/Confetti.json";
import { motion, Variants } from "framer-motion";

const RunnerGame: React.FC = () => {
  const router = useRouter();
  const data = useContext(RoomContext);

  const [gameStarted, setGameStarted] = useState(false);
  const [playersPositions, setPlayersPositions] = useState<
    Record<string, number>
  >({});
  const [winner, setWinner] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [isCounting, setIsCounting] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const roomData = data?.roomData;
  const socket = data?.socket;
  const playerName = data?.playerName;
  const isHost = playerName && roomData ? roomData.host === playerName : false;

  useEffect(() => {
    if (!socket) return;

    const handlePositions = (positions: Record<string, number>) =>
      setPlayersPositions(positions);
    const handleStart = () => {
      setIsCounting(true);
      setGameStarted(false);
    };
    const handleFinish = ({ winner }: { winner: string }) => {
      setWinner(winner);
      setGameStarted(false);
      setIsCounting(false);
      setCountdown(3);
    };

    socket.on("runner:update_positions", handlePositions);

    socket.on("runner:start_game", handleStart);
    socket.on("runner:finish", handleFinish);

    return () => {
      socket.off("runner:update_positions", handlePositions);
      socket.off("runner:start_game", handleStart);
      socket.off("runner:finish", handleFinish);
    };
  }, [socket]);

  // Reset game state when players change
  useEffect(() => {
    if (!roomData || !roomData.players) return;
    const initialPositions: Record<string, number> = {};
    roomData.players.forEach((p) => (initialPositions[p] = 0));
    setPlayersPositions(initialPositions);
    setWinner(null);
    setGameStarted(false);
    setCountdown(3);
    setIsCounting(false);
  }, [roomData]);

  // Countdown logic
  useEffect(() => {
    if (isCounting) {
      const intervalId = setInterval(() => {
        setCountdown((prevCount) => {
          if (prevCount <= 1) {
            clearInterval(intervalId);
            setIsCounting(false);
            setGameStarted(true);
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);
      timerRef.current = intervalId;
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isCounting]);

  const startGame = () => {
    if (!isHost || !socket || !roomData || gameStarted || isCounting) return;

    socket.emit("runner:start_game", { roomCode: roomData.roomCode });
  };

  const moveForward = () => {
    if (!roomData || !socket || !playerName || !gameStarted) return;

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
    router.push(
      `/lobby?roomCode=${roomData.roomCode}&playerName=${playerName}`
    );
  };
  const winnerVariants: Variants = {
    hidden: { y: "100%", opacity: 0, scale: 0.8 },
    visible: {
      y: "0%",
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        delay: 0.5,
      },
    },
    exit: { y: "100%", opacity: 0, scale: 0.8 },
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

  const showStartButton = isHost && !gameStarted && !isCounting && !winner;
  const showRaceButton = gameStarted && !isCounting && !winner;
  const showWaitingText = !isHost && !gameStarted && !isCounting && !winner;

  return (
    <div className="min-h-screen p-8 bg-blue-200 flex flex-col items-center">
      <IconBackground />

      <div className="flex items-center gap-2 w-full max-w-xs sm:max-w-md mb-6">
        <div className="relative p-[2px] rounded-md bg-gradient-to-br from-blue-400 via-blue-400 to-violet-400">
          <button
            className="bg-blue-300 hover:bg-blue-400 px-4 py-2 rounded-md text-white flex items-center justify-center relative z-10"
            onClick={backLobby}
          >
            <SquareArrowLeft />
          </button>
        </div>
        <span className="text-sm text-blue-800">Дууссан бол энд дарна уу</span>
      </div>

      {winner ? (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center z-50 p-4"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={winnerVariants}
          style={{ backdropFilter: "blur(8px)" }}
        >
          <div className="flex items-center gap-2 w-full max-w-xs sm:max-w-md mb-6 relative z-50">
            <div className="relative p-[2px] rounded-md bg-gradient-to-br from-blue-400 via-green-400 to-indigo-400">
              <button
                className="bg-blue-300 hover:bg-blue-400 px-4 py-2 rounded-md text-white flex items-center justify-center relative z-10"
                onClick={backLobby}
              >
                <SquareArrowLeft />
              </button>
            </div>
            <span className="text-sm text-blue-800">
              Дууссан бол энд дарна уу
            </span>
          </div>

          <Lottie
            animationData={globeAnimation}
            loop={true}
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="relative z-10 text-center p-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-700 shadow-lg max-w-md w-full">
            <div className="text-6xl mb-4">🐌</div>
            <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-2">
              Тооцооноос зугтаж чадлаа!
            </h2>
            <div className="text-xl font-bold text-green-500 dark:text-green-300 bg-white dark:bg-slate-800 px-6 py-3 rounded-full shadow-md">
              🎉 {winner} 🎉
            </div>
          </div>
        </motion.div>
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
              <div
                key={name}
                className="w-full bg-white rounded-full h-6 relative"
              >
                <div
                  className={`h-6 rounded-full transition-all duration-500 ${
                    name === playerName ? "bg-blue-500" : "bg-gray-400"
                  }`}
                  style={{ width: `${progress}%` }}
                />
                <span className="absolute left-2 top-0 text-sm font-bold z-10">
                  {name}
                </span>
                <span
                  className="absolute top-1/2 -translate-y-1/2 z-20 transition-all duration-500 text-sm"
                  style={{
                    left: `${progress}%`,
                    transform: "translateX(-50%)",
                  }}
                >
                  🐌
                </span>
              </div>
            );
          })}

          <div className="fixed bottom-0 left-0 right-0 z-50 p-16 flex justify-center">
            {isCounting && (
              <div className="text-9xl text-gray-800 font-bold animate-bounce transition-all duration-300">
                {countdown > 0 ? countdown : "Эхэллээ!"}
              </div>
            )}
            {showStartButton && (
              <button
                onClick={startGame}
                className="mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl items-center"
              >
                Тоглоомыг эхлүүлэх
              </button>
            )}
            {showRaceButton && (
              <button
                onClick={moveForward}
                className="mt-6 bg-blue-400 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl items-center"
              >
                🐌 Гүйгээд урагшаа
              </button>
            )}
            {showWaitingText && (
              <div className="text-center text-lg font-bold text-gray-600">
                Боссыг тоглоомыг эхлүүлэхийг хүлээнэ үү
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RunnerGame;
