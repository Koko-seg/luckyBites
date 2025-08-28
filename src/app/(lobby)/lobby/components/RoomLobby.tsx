import { ArrowLeft, LogOut } from "lucide-react";

import { useContext } from "react";

import { PlayerCardGeneral } from "./PlayerCardGeneral";
import { RoomInfoCard } from "./RoomInfoCard";
import { RoomContext } from "@/context/roomContextTest";
import ExcuseCard from "@/app/(lobby)/games/excuse/components/ExcuseCard";
import { GameButton } from "./GameButton";
import RaceGame from "@/app/(lobby)/games/runnerGame/page";

export const RoomLobby = () => {

  const  data  = useContext(RoomContext);
  const { roomData } = data || {};

  if (!roomData) {
    return <div>Лобби ачааллаж байна...</div>;
  }

  const games = [
    {
      id: "excuse",
      name: "Шалтаг тоочье",
      component: ExcuseCard,
      description: "Жижиг тайлбар.",
      icon: LogOut,
      color: "bg-blue-400",
      textColor: "text-blue-900",
    },
    {
      id: "spin",
      name: "Азаа үзье",
      component: ExcuseCard,
      description: "Жижиг тайлбар.",
      icon: LogOut,
      color: "bg-blue-400",
      textColor: "text-blue-900",
    },
    {
      id: "runnerGame",
      name: "Уралдая",
      component: RaceGame,
      description: "Жижиг тайлбар.",
      icon: LogOut,
      color: "bg-blue-400",
      textColor: "text-blue-900",
    },
    {
      id: "vote",
      name: "Хамгийн хамгийн",
      component: ExcuseCard,
      description: "Жижиг тайлбар.",
      icon: LogOut,
      color: "bg-blue-400",
      textColor: "text-blue-900",
    },
  ];

  console.log(roomData);
  const canStart = roomData.players.length >= 2;
  const selectedGame = roomData.selectedGame;
  // roomData dotorh "gameState" baidliig shalgana
  if (roomData.gameStatus === "STARTED") {
    // Togloom ehleegui baisan ch, ehlehiig zaaj ogoh heregtei.
    const CurrentGameComponent = games.find(
      (game) => game.id === roomData.currentGame
    )?.component;

    // Harin "in-game" baih uyd togloomiig haruulna
    if (CurrentGameComponent) {
      return <CurrentGameComponent />;
    }
    return <div>Тоглоом олдсонгүй!</div>;
  }

  return (

    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-blue-70 p-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button
            // onClick={onBack}
            className="flex items-center gap-2 text-blue-700 hover:text-blue-800 font-medium transition-colors bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm"
          >
            <ArrowLeft size={20} />
            Нүүр хуудас
          </button>
          <button
            // onClick={handleLeaveRoom}
            className="flex items-center gap-2 text-red-700 hover:text-red-800 font-medium transition-colors bg-red-100/50 hover:bg-red-100/80 px-4 py-2 rounded-full backdrop-blur-sm border border-red-200"
          >
            <LogOut size={20} />
            Өрөөнөөс гарах
          </button>
        </div>
        <div className="w-24" />
      </div>
      <RoomInfoCard />
      <PlayerCardGeneral />
      <div className="text-center mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {games.map((game) => (
            <GameButton
              key={game.id}
              game={game}
              canStart={canStart}
              selectedGame={selectedGame}
            />
          ))}
        </div>
      </div>

      <div className="mt-12 flex justify-center space-x-6">
        {["red", "yellow", "purple"].map((color, idx) => (
          <div
            key={idx}
            className={`w-6 h-6 bg-${color}-400 rounded-full animate-bounce opacity-60`}
            style={{ animationDelay: `${idx * 0.2}s` }}
          ></div>
        ))}
      </div>
    </div>
  );
};
