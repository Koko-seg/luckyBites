"use client";

import { IconBackground } from "@/components/IconBackground";
import { RoomLobby } from "./components/RoomLobby";

export default function Lobby() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 p-4">
      <IconBackground />
      <RoomLobby />
    </div>
  );
}
