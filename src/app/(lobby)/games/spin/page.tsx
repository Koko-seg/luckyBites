"use client"
 
import { useContext, useState } from "react"
import { Button } from "@/components/ui/button"
 
// src/components/ui/card.tsx
import React from "react";
import { RoomContext } from "@/context/roomContextTest";
 
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
 
 
const WHEEL_SEGMENTS = [
  { text: "YOKO", color: "#3B82F6", textColor: "#FFFFFF" }, 
]
 

export default function SpinWheelPage() {
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [winner, setWinner] = useState<string | null>(null)
    const data = useContext(RoomContext);
    const { roomData, socket, playerName } = data || {};
  if (!socket || !roomData || !playerName) {
    return <div>Лобби ачааллаж байна...</div>;
  }
 
  // Эргүүлэх функц
  const spinWheel = () => {
    if (isSpinning) return
 
    setIsSpinning(true)
    setWinner(null)
 
    // Generate random rotation (multiple full rotations + random angle)
    const spins = Math.floor(Math.random() * 5) + 5 // 5-10 full rotations
    const finalAngle = Math.floor(Math.random() * 360)
    const totalRotation = rotation + spins * 360 + finalAngle
 
    setRotation(totalRotation)
 
    // Calculate winner after spin completes
    setTimeout(() => {
      const segmentAngle = 360 / WHEEL_SEGMENTS.length
      const normalizedAngle = (360 - (totalRotation % 360)) % 360
      const winnerIndex = Math.floor(normalizedAngle / segmentAngle)
      setWinner(WHEEL_SEGMENTS[winnerIndex].text)
      setIsSpinning(false)
    }, 3000)
  }
 
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md sm:max-w-2xl shadow-2xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
  <CardHeader className="text-center pb-4">
    <CardTitle className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
      Хэн нь азтайгаа үзэх үү?
    </CardTitle>
    <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm sm:text-base">
      Эргүүлээд азаа үз
    </p>
  </CardHeader>
 
  <CardContent className="flex flex-col items-center space-y-8">
    {/* Wheel Container */}
    <div className="relative">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3 z-20">
    <div className="w-0 h-0 border-l-6 border-r-6  border-t-12 border-l-transparent border-r-transparent border-t-slate-800 dark:border-t-white drop-shadow-lg"></div>
    </div>
 
      <div
        className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full overflow-hidden transition-transform duration-[3000ms] ease-out shadow-2xl ring-8 ring-white dark:ring-slate-700"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {WHEEL_SEGMENTS.map((segment, index) => {
          const angle = (360 / WHEEL_SEGMENTS.length) * index;
          const nextAngle = (360 / WHEEL_SEGMENTS.length) * (index + 1);
          return (
            <div key={index} className="absolute inset-0">
              <div
                className="absolute w-full h-full"
                style={{
                  background: `conic-gradient(from ${angle}deg, ${segment.color} 0deg, ${segment.color} ${360 / WHEEL_SEGMENTS.length}deg, transparent ${360 / WHEEL_SEGMENTS.length}deg)`,
                  clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos(((angle - 90) * Math.PI) / 180)}% ${50 + 50 * Math.sin(((angle - 90) * Math.PI) / 180)}%, ${50 + 50 * Math.cos(((nextAngle - 90) * Math.PI) / 180)}% ${50 + 50 * Math.sin(((nextAngle - 90) * Math.PI) / 180)}%)`,
                  filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.3))",
                }}
              />
 
              <div
                className="absolute w-full h-full border-white border-2"
                style={{
                  clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos(((angle - 90) * Math.PI) / 180)}% ${50 + 50 * Math.sin(((angle - 90) * Math.PI) / 180)}%, ${50 + 50 * Math.cos(((nextAngle - 90) * Math.PI) / 180)}% ${50 + 50 * Math.sin(((nextAngle - 90) * Math.PI) / 180)}%)`,
                }}
              />
 
              <div
                className="absolute font-bold text-sm sm:text-lg drop-shadow-lg"
                style={{
                  color: segment.textColor,
                  left: `${50 + 30 * Math.cos(((angle + 360 / WHEEL_SEGMENTS.length / 2 - 90) * Math.PI) / 180)}%`,
                  top: `${50 + 30 * Math.sin(((angle + 360 / WHEEL_SEGMENTS.length / 2 - 90) * Math.PI) / 180)}%`,
                  transform: `translate(-50%, -50%) rotate(${angle + 360 / WHEEL_SEGMENTS.length / 2}deg)`,
                  textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                }}
              >
                {segment.text}
              </div>
            </div>
          );
        })}
 
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-400 rounded-full shadow-2xl border-4 border-white dark:border-slate-800 z-10">
          <div className="absolute inset-2 bg-gradient-to-tl from-slate-600 to-slate-800 dark:from-slate-300 dark:to-slate-500 rounded-full"></div>
        </div>
      </div>
    </div>
 
    <Button
      onClick={spinWheel}
      disabled={isSpinning}
      size="lg"
      className="px-6 py-3 text-lg sm:px-12 sm:py-4 sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg transform hover:scale-105 transition-all duration-200"
    >
      {isSpinning ? "🎯 эргэж байна..." : "🎲 Эргүүлнэ үү!"}
    </Button>
     {winner && (
            <div className="text-center p-8 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border-2 border-green-200 dark:border-green-700 shadow-lg">
              <div className="text-6xl mb-4">🎉</div>
              {/* <h3 className="text-3xl font-bold text-green-800 dark:text-green-200 mb-2">Congratulations!</h3> */}
              <p className="text-2xl font-bold text-green-700 dark:text-green-300 bg-white dark:bg-slate-800 px-6 py-3 rounded-full shadow-md">
                Азтай золиг вэ чи  {winner}!
              </p>
            </div>
          )}
  </CardContent>
</Card>
 
    </div>
  )
}