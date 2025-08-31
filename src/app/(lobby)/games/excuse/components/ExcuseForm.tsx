"use client";

import type React from "react";
import { useState, ChangeEvent, FormEvent, useContext } from "react";
import { RoomContext } from "@/context/roomContextTest";

interface ExcuseFormProps {
  onSuccess?: () => void;
}

export const ExcuseForm: React.FC<ExcuseFormProps> = ({ onSuccess }) => {
  const [reason, setReason] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [roast, setRoast] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const data = useContext(RoomContext);
  const roomCode = data?.roomData?.roomCode;

  const socketId = data?.socket?.id;

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setReason(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    setLoading(true);
    setError("");
    setRoast(null);
    setStatusMessage(null);

    try {
      const response = await fetch(`http://localhost:4200/roast`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: roomCode,
          players: [{ socketId, reason }],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatusMessage(data.message || "Roast авахад алдаа гарлаа");
      } else {
        setReason("");
        if (data.roast) {
          setRoast(data.roast);
          setStatusMessage("Roast амжилттай үүслээ!");
        } else if (data.message) {
          setStatusMessage(data.message);
        }
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Сервертэй холбогдоход алдаа гарлаа";
      setError(message);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center p-6">
      {/* ✅ Энд гадна талын градиент хүрээний div-ийг нэмсэн */}
      <div className="bg-gradient-to-br from-yellow-400 via-purple-500 to-blue-500 p-[2px] rounded-xl shadow-lg w-full max-w-md">
        <div className="bg-white p-6 rounded-xl relative z-10 w-full">
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              className="w-full p-3 border rounded-xl resize-none h-24 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Яагаад мөнгө төлөхгүй байгаа шалтгаанаа бич..."
              value={reason}
              onChange={handleChange}
              disabled={loading}
              required
            />

            <button
              type="submit"
              disabled={loading || !reason.trim()}
              className="w-full bg-violet-500 text-white py-2 rounded-xl hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Илгээж байна..." : "Шалтгаанаа илгээх"}
            </button>
            {error && <p className="text-red-600 text-center">{error}</p>}
          </form>

          {statusMessage && (
            <p className="text-blue-600 font-semibold text-center mt-4">
              {statusMessage}
            </p>
          )}
          {roast && (
            <div className="mt-4 bg-yellow-50 border border-yellow-300 p-4 rounded-xl shadow">
              <h3 className="text-lg font-bold text-yellow-800 mb-2">
                🤖 AI Roast:
              </h3>
              <p className="italic text-gray-800">{roast}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
