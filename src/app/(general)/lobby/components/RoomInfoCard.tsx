import { RoomContext } from "@/context/roomContextTest";
import { useContext } from "react";
// Import the context

export const RoomInfoCard = () => {
  const data = useContext(RoomContext);
  const { roomData } = data || {};

  if (!roomData) {
    return <div></div>;
  }

  return (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 text-center">
        {/* Өөрчлөлт: Бүх мэдээллийг нэг div дотор нэгтгэлээ */}
        <div className="text-center">
          <h2 className="text-1xl font-black text-purple-700 mb-2">
            Өрөөний код:
            <span className="px-3 py-1 text-purple-900 font-mono text-lg font-bold">
              {roomData.roomCode}
            </span>
          </h2>
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-1xl font-black text-purple-600">
              Өрөөний нэр:
            </h1>
            <span className="text-1xl font-black text-yellow-400">
              {roomData.roomName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
