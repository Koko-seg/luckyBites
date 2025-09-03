"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ExcuseBackground } from "@/components/excuseBackground";
import { IconBackground } from "@/components/IconBackground";

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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/room`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomName, hostNickname }),
        }
      );

      const data: {
        roomName: string;
        roomCode: string;
        roomId: number;
        message?: string;
      } = await response.json();

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
    } catch (err: unknown) {
      let message = "Алдаа гарлаа";
      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === "string") {
        message = err;
      } else {
        message = JSON.stringify(err);
      }
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-200 to-orange-200 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
      <ExcuseBackground />
      <IconBackground />

      <form
        onSubmit={handleCreateRoom}
        className="bg-white p-8 w-full max-w-md rounded-xl shadow-lg relative z-10"
      >
        <div className="items-center text-center mb-8">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-7xl font-black text-violet-600 mb-2 sm:mb-4 drop-shadow-md transform -rotate-2">
            Өрөө
          </h1>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-7xl font-black text-yellow-400 mb-2 drop-shadow-md transform rotate-1 animate-pulse">
            Үүсгэх
          </h1>
          <div className="w-60 sm:w-60 h-1 sm:h-1.5 bg-yellow-300 mx-auto rounded-full "></div>
        </div>

        <input
          type="text"
          placeholder="Өрөөний нэр"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
        />

        <input
          type="text"
          placeholder="Нэрээ оруулна уу (Host)"
          value={hostNickname}
          onChange={(e) => setHostNickname(e.target.value)}
          className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition-colors mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
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
