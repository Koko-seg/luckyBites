"use client";

import React, { useState, useContext, useEffect, ChangeEvent, FormEvent } from "react";
import { RoomContext } from "@/context/roomContextTest";

export const ExcuseForm = () => {
  const data = useContext(RoomContext);
  const roomCode = data?.roomData?.roomCode;
  const socket = data?.socket;
  const playerName = data?.playerName; // context-д хадгалсан player name

  const [reason, setReason] = useState("");
  const [allReasons, setAllReasons] = useState<{ socketId: string; reason: string }[]>([]);
  const [timer, setTimer] = useState<number | null>(null);
  const [roast, setRoast] = useState<string | null>(null);
  const [chosen, setChosen] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!reason.trim() || !roomCode) return;
    socket?.emit("roast:submit_reason", { roomCode, reason });
    setReason("");
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("roast:reason_submitted", (player) => {
      setAllReasons((prev) => [...prev, player]);
    });

    socket.on("roast:timer_update", (time: number) => setTimer(time));

    socket.on("roast:timer_finished", () => setTimer(0));

    socket.on("roast:result", ({ roast, chosen }) => {
      setRoast(roast);
      setChosen(chosen);
    });

    return () => {
      socket.off("roast:reason_submitted");
      socket.off("roast:timer_update");
      socket.off("roast:timer_finished");
      socket.off("roast:result");
    };
  }, [socket]);

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full p-3 border rounded-xl resize-none h-24"
          placeholder="Шалтгаанаа бич..."
          value={reason}
          onChange={handleChange}
          disabled={timer === 0}
        />
        <button
          type="submit"
          disabled={!reason.trim() || timer === 0}
          className="w-full bg-violet-500 text-white py-2 rounded-xl"
        >
          Илгээх
        </button>
      </form>

      {timer !== null && timer > 0 && (
        <p className="text-center mt-2">⏳ Үлдсэн хугацаа: {timer} сек</p>
      )}

      {allReasons.length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold">Илгээсэн шалтгаанууд:</h3>
          <ul className="list-disc list-inside">
            {allReasons.map((p, idx) => (
              <li key={idx}>
                <span className="font-semibold">{}</span> {p.reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {roast && (
        <div className="mt-4 bg-yellow-50 p-4 rounded-xl border border-yellow-300">
          <h3 className="font-bold mb-2">🤖 AI Roast:</h3>
          <p>{roast}</p>
          {/* {chosen && <p className="mt-2 text-sm text-gray-600">👉 Сонгогдсон шалтгаан: {chosen}</p>}     */}
        </div>
      )}
    </div>
  );
};
