"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CreateRoomFormProps {
  onRoomCreated?: (room: {
    roomName: string;
    roomCode: string;
    roomId: number;
  }) => void;
}

export default function CreateRoom({ onRoomCreated }: CreateRoomFormProps) {
  const router = useRouter();

  const [roomName, setRoomName] = useState("");
  const [hostNickname, setHostNickname] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCreateRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:4200/room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomName, hostNickname }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Өрөө үүсгэхэд алдаа гарлаа");
      }

      if (onRoomCreated) {
        onRoomCreated({
          roomName: data.roomName,
          roomCode: data.roomCode,
          roomId: data.roomId,
        });
      }

  
     router.push(
        `/lobby?roomId=${data.roomId}&roomCode=${data.roomCode}&playerName=${hostNickname}`
      );
    } catch (err: any) {
      const message = err.message || err;
      setErrorMessage(typeof message === 'object' ? JSON.stringify(message) : message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
      <form
        className="bg-white p-8 w-full max-w-md rounded-xl shadow-lg"
        onSubmit={handleCreateRoom}
      >
        <div className="items-center text-center mb-8">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-green-300 mb-2 sm:mb-4 drop-shadow-2xl transform -rotate-2">
            Өрөө
          </h1>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-yellow-400 mb-2 drop-shadow-2xl transform rotate-1">
            Үүсгэх
          </h1>
        </div>

        <input
          type="text"
          placeholder="Өрөөний нэр"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="text"
          placeholder="Нэрээ оруулна уу (Host)"
          value={hostNickname}
          onChange={(e) => setHostNickname(e.target.value)}
          className="w-full mb-6 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Үүсгэж байна..." : "Өрөө Үүсгэх"}
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
