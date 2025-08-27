import { RoomContext } from "@/context/roomContextTest";
import { useContext } from "react";
// Import the context

export const RoomInfoCard = () => {
  const roomData = useContext(RoomContext);

  if (!roomData) {
    return <div>Лобби ачааллаж байна...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 text-center">
        <div className="flex items-center gap-2 text-center">
          <h2 className="font-bold text-blue-800">Өрөөний код:</h2>
          <h2 className="px-3 py-1 text-blue-900 font-mono text-lg font-bold">
            {roomData.roomCode}
          </h2>
        </div>
        <div className="flex items-center justify-center gap-4 text-blue-600">
          <h1 className="text-1xl font-black text-blue-800 mb-2">
            Өрөөний нэр: {roomData.roomName}
          </h1>
          <p className="text-xl mb-6">Хост: {roomData.host}</p>
        </div>
      </div>
    </div>
  );
};
