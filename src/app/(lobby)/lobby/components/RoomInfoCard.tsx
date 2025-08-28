import { RoomContext } from "@/context/roomContextTest";
import { useContext } from "react";
// Import the context

export const RoomInfoCard = () => {
  const data = useContext(RoomContext);
  const { roomData } = data || {};

  if (!roomData) {
    return <div>Лобби ачааллаж байна...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 text-center">
        <div className="flex items-center gap-2 text-center justify-center">
          <h2 className="text-1xl font-black text-purple-700 mb-2">Өрөөний код:</h2>
          <h2 className="px-3 py-1 text-purple-900 font-mono text-lg font-bold">
            {roomData.roomCode}
          </h2>
        </div>
        <div className="flex items-center justify-center gap-4 text-purple-600">
          <h1 className="text-1xl font-black text-purple-600 mb-2">
            Өрөөний нэр: 
          </h1>
          <span className="text-1xl font-black text-yellow-400 mb-2">
            {roomData.roomName}
          </span>
        </div>
      </div>
    </div>
  );
};