"use client";

import { IconBackground } from "@/components/IconBackground";
import { RoomLobby } from "./components/RoomLobby";
import { Suspense } from "react";

export default function Lobby() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 p-4">
        <IconBackground />
        <RoomLobby />
      </div>
    </Suspense>
  );
}
