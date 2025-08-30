"use client"

import { useContext, useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RoomContext, useRoom } from "@/context/roomContextTest"
import { useRouter } from "next/navigation";

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-xl shadow-md bg-white p-6 ${className}`}>{children}</div>;
}
export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}
export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h2 className={`text-2xl font-semibold ${className}`}>{children}</h2>;
}
export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`${className}`}>{children}</div>;
}

export default function SpinWheelPage() {
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const router = useRouter()
  const [winner, setWinner] = useState<string | null>(null)
  const data = useContext(RoomContext);
  const { roomData, socket, playerName } = data || {};
  const roomCode = roomData?.roomCode || "";

  if (!socket || !roomData || !playerName) return <div>Лобби ачааллаж байна...</div>;

  const isHost = roomData.host === playerName;

  const WHEEL_COLORS = ['#C084FC', '#FFD700', '#8BC34A', '#64B5F6', '#FF8A65', '#F06292', '#4DD0E1', '#C5E1A5'];

  const WHEEL_SEGMENTS = useMemo(() => {
    return roomData.players.map((player, index) => ({
      text: player,
      color: WHEEL_COLORS[index % WHEEL_COLORS.length],
      textColor: '#FFFFFF',
    }));
  }, [roomData.players]);

  // --- Socket listener ---
  useEffect(() => {
    if (!socket) return;

    const handleSpinUpdate = ({ rotation, winner }: { rotation: number, winner: string }) => {
      setRotation(rotation);
      setTimeout(() => {
        setWinner(winner);
        setIsSpinning(false);
      }, 3000); // animation хугацаа дууссаны дараа харуулах
    };

    socket.on("spinUpdate", handleSpinUpdate);
    return () => { socket.off("spinUpdate", handleSpinUpdate); }
  }, [socket]);

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

    // --- Emit spin ---
    socket.emit("spin", { rotation: totalRotation, winner: newWinner, roomCode });
  };
  const backLobby = () => {
    router.push(`/lobby?roomCode=${roomData.roomCode}&playerName=${playerName}`);
  };
  return (

    <div className="min-h-screen bg-gradient-to-br from-purple-200 to-purple-400 flex items-center justify-center p-4">
      <div>
        <div>
          <Card className="w-full max-w-md sm:max-w-2xl shadow-2xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Хэн нь азтайгаа үзэх үү?
              </CardTitle>
              <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm sm:text-base">Эргүүлээд азаа үз</p>
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
                    background: `conic-gradient(${WHEEL_SEGMENTS.map((s, i) => `${s.color} ${i * (360 / WHEEL_SEGMENTS.length)}deg, ${s.color} ${(i + 1) * (360 / WHEEL_SEGMENTS.length)}deg`).join(', ')})`,
                  }}
                >
                  {WHEEL_SEGMENTS.map((segment, index) => {
                    const segmentAngle = 360 / WHEEL_SEGMENTS.length;
                    const offsetAngle = index * segmentAngle;
                    const textRotation = offsetAngle + segmentAngle / 2;
                    return (
                      <div key={index} className="absolute font-bold text-sm sm:text-lg z-10"
                        style={{
                          left: '50%',
                          top: '50%',
                          transform: `rotate(${textRotation}deg) translateY(-100px) translateX(-50%)`,
                          transformOrigin: 'center',
                          color: segment.textColor,
                        }}>
                        <span style={{ transform: `rotate(-${textRotation}deg)`, textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
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
                className={`px-6 py-3 text-lg sm:px-12 sm:py-4 sm:text-xl font-bold shadow-lg transform transition-all duration-200 
              ${isHost ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105"
                    : "bg-gray-400 cursor-not-allowed"}`}
              >
                {isHost ? (isSpinning ? '🎯 эргэж байна...' : '🎲 Эргүүлнэ үү!') : '👑 Host л эргүүлнэ'}
              </Button>

              {/* Winner */}
              {!isSpinning && winner && (
                <div className="text-center p-8 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl border-2 border-purple-200 dark:border-purple-700 shadow-lg">
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300 mb-2">Азтай золиг вэ чи!</h2>
                  <p className="text-xl font-bold text-purple-700 dark:text-purple-300 bg-white dark:bg-slate-800 px-6 py-3 rounded-full shadow-md">{winner}</p>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
        <div className="flex justify-between p-2">
          <div></div>
          <button
            className="px-4 py-2 rounded-lg bg-purple-500 text-white font-medium shadow-md hover:bg-orange-600 hover:shadow-lg transition-all duration-300"
            onClick={ backLobby}
          >
            butsah
          </button>
        </div>
      </div>
    </div>
  );
}
