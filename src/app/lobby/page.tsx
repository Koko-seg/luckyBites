"use client";

import { RoomLobby } from "./components/RoomLobby";
import { RoomProvider } from "@/context/roomContextTest";

export default function Lobby() {

  return (
    <RoomProvider>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 p-4">
       
        <RoomLobby />
      </div>
    </RoomProvider>
  );
}
