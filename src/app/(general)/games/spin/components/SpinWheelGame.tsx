"use client";

import { useContext, useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RoomContext } from "@/context/roomContextTest";
import { useRouter } from "next/navigation";
import { ExcuseBackground } from "@/components/excuseBackground";
import { IconBackground } from "@/components/IconBackground";
import { SquareArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Lottie from "lottie-react";
import globeAnimation from "@/animation/Confetti.json";

export function SpinWheelPage() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);

  const router = useRouter();
  const data = useContext(RoomContext);
  const { roomData, socket, playerName } = data || {};
  const roomCode = roomData?.roomCode || "";
  const isHost = roomData?.host === playerName;

  const WHEEL_COLORS = useMemo(
    () => [
      "#C084FC",
      "#FFD700",
      "#8BC34A",
      "#64B5F6",
      "#FF8A65",
      "#F06292",
      "#4DD0E1",
      "#C5E1A5",
    ],
    []
  );

  const WHEEL_SEGMENTS = useMemo(() => {
    if (!roomData?.players) return [];
    return roomData.players.map((player, index) => ({
      text: player,
      color: WHEEL_COLORS[index % WHEEL_COLORS.length],
      textColor: "#FFFFFF",
    }));
  }, [roomData?.players, WHEEL_COLORS]);

  // --- Socket listener ---
  useEffect(() => {
    if (!socket) return;

    const handleSpinUpdate = ({
      rotation,
      winner,
    }: {
      rotation: number;
      winner: string;
    }) => {
      setRotation(rotation);
      setTimeout(() => {
        setWinner(winner);
        setIsSpinning(false);
      }, 10000);
    };

    socket.on("spinUpdate", handleSpinUpdate);
    return () => {
      socket.off("spinUpdate", handleSpinUpdate);
    };
  }, [socket]);

  // --- Early loading state ---
  if (!socket || !roomData || !playerName) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Лобби ачааллаж байна...</p>
      </div>
    );
  }

  const spinWheel = () => {
    if (isSpinning || !isHost) return;

    setIsSpinning(true);
    setWinner(null);

    const spins = Math.floor(Math.random() * 5) + 5;
    const finalAngle = Math.floor(Math.random() * 360);
    const totalRotation = rotation + spins * 360 + finalAngle;

    const segmentAngle = 360 / WHEEL_SEGMENTS.length;
    const normalizedAngle = (360 - (totalRotation % 360)) % 360;
    const winnerIndex = Math.floor(normalizedAngle / segmentAngle);
    const newWinner = WHEEL_SEGMENTS[winnerIndex].text;

    socket.emit("spin", {
      rotation: totalRotation,
      winner: newWinner,
      roomCode,
    });
  };

  const backLobby = () => {
    router.push(
      `/lobby?roomCode=${roomData.roomCode}&playerName=${playerName}`
    );
  };

  return (
    <div className="min-h-screen p-8 bg-orange-200 flex flex-col items-center">
      <ExcuseBackground />
      <IconBackground />

      <div className="flex justify-between w-full max-w-lg mb-6">
        <div className="relative p-[2px] rounded-md bg-gradient-to-br from-orange-400 via-blue-400 to-violet-400">
          <button
            className="bg-orange-300 hover:bg-orange-400 px-4 py-2 rounded-md text-white flex items-center justify-center relative z-10"
            onClick={backLobby}
          >
            <SquareArrowLeft />
          </button>
        </div>
      </div>

      <Card className="w-full max-w-md sm:max-w-2xl shadow-2xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
            Хэний данс өнөөдөр амрах вэ?
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center space-y-8">
          {/* Wheel */}
          <div className="relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3 z-20">
              <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[12px] border-l-transparent border-r-transparent border-t-slate-800 dark:border-t-white drop-shadow-lg"></div>
            </div>

            <div
              className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full overflow-hidden transition-transform duration-[3000ms] ease-out shadow-2xl ring-8 ring-white dark:ring-slate-700"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: "transform 10s cubic-bezier(0, 1, 0.25, 1)",
                background: `conic-gradient(${WHEEL_SEGMENTS.map(
                  (s, i) =>
                    `${s.color} ${i * (360 / WHEEL_SEGMENTS.length)}deg, ${
                      s.color
                    } ${(i + 1) * (360 / WHEEL_SEGMENTS.length)}deg`
                ).join(", ")})`,
              }}
            >
              {WHEEL_SEGMENTS.map((segment, index) => {
                const segmentAngle = 360 / WHEEL_SEGMENTS.length;
                const offsetAngle = index * segmentAngle;
                const textRotation = offsetAngle + segmentAngle / 2;
                return (
                  <div
                    key={index}
                    className="absolute font-bold text-sm sm:text-lg z-10"
                    style={{
                      left: "50%",
                      top: "50%",
                      transform: `rotate(${textRotation}deg) translateY(-100px) translateX(-50%)`,
                      transformOrigin: "center",
                      color: segment.textColor,
                    }}
                  >
                    <span
                      style={{
                        transform: `rotate(-${textRotation}deg)`,
                        textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                      }}
                    >
                      {segment.text}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-400 rounded-full shadow-2xl border-4 border-white dark:border-slate-800 z-20">
              <div className="absolute inset-2 bg-gradient-to-tl from-slate-600 to-slate-800 dark:from-slate-300 dark:to-slate-500 rounded-full"></div>
            </div>
          </div>

          {/* Spin Button */}
          <Button
            onClick={spinWheel}
            disabled={isSpinning || !isHost}
            size="lg"
            className={`px-6 py-3 text-lg sm:px-12 sm:py-4 sm:text-xl font-bold shadow-lg transform transition-all duration-200 animate-pulse
              ${
                isHost
                  ? "bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 hover:scale-105"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
          >
            {isHost
              ? isSpinning
                ? "🎯 эргэж байна..."
                : "🎲 Эргүүлнэ үү!"
              : "👑 Босс чинь л эргүүлнэ дээ"}
          </Button>

          {/* Winner */}
          {!isSpinning && winner && (
            <div className="text-center p-8 bg-gradient-to-r from-orange-50 to-indigo-50 dark:from-orange-900/20 dark:to-indigo-900/20 rounded-2xl border-2 border-orange-200 dark:border-orange-700 shadow-lg">
              <div className="text-6xl mb-4">
                🎉
                <Lottie
                  animationData={globeAnimation}
                  loop={true}
                  className="absolute inset-0 text-purple-500"
                />
              </div>
              <h2 className="text-2xl font-bold text-orange-700 dark:text-orange-300 mb-2">
                Азтай золиг вэ чи!
              </h2>
              <div className="text-xl font-bold text-yellow-500 dark:text-yellow-300 bg-white dark:bg-slate-800 px-6 py-3 rounded-full shadow-md">
                🎉 {winner} 🎉
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
