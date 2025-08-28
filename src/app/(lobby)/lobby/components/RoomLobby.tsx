import { ArrowLeft, LogOut } from "lucide-react";

import { useContext } from "react";

import { PlayerCardGeneral } from "./PlayerCardGeneral";
import { RoomInfoCard } from "./RoomInfoCard";
import { RoomContext } from "@/context/roomContextTest";
import ExcuseCard from "@/app/(lobby)/games/excuse/components/ExcuseCard";
import { GameButton } from "./GameButton";
import RaceGame from "@/app/(lobby)/games/runnerGame/page";
import SpinWheelPage from "../../games/spin/page";

export const RoomLobby = () => {
  const data = useContext(RoomContext);
  const { roomData } = data || {};

  if (!roomData) {
    return <div>Лобби ачааллаж байна...</div>;
  }

  const games = [
    {
      id: "excuse",
      name: "Шалтаг тоочье",
      component: ExcuseCard,
      description: "Хэн нь сайн шалтаг тоочих вэ?.",
      icon: LogOut,
      color: "bg-purple-600",
      textColor: "text-white",
    },
    {
      id: "spin",
      name: "Азаа үзье",
      component: SpinWheelPage,
      description: "Өнөөдөр азтай өдөр чинь байх болов уу даа.",
      icon: LogOut,
      color: "bg-pink-600",
      textColor: "text-white",
    },
    {
      id: "runnerGame",
      name: "Уралдах уу",
      component: RaceGame,
      description: "Гэхдээ ухаанаараа биш шүү хаха.",
      icon: LogOut,
      color: "bg-green-500",
      textColor: "text-white",
    },
    {
      id: "vote",
      name: "Хамгийн хамгийн",
      component: ExcuseCard,
      description: "За тэгээд гомдоод байв.",
      icon: LogOut,
      color: "bg-yellow-500",
      textColor: "text-white",
    },
  ];

  console.log(roomData);
  const canStart = roomData.players.length >= 2;
  const selectedGame = roomData.selectedGame;

  if (roomData.gameStatus === "STARTED") {

    const CurrentGameComponent = games.find(
      (game) => game.id === roomData.currentGame
    )?.component;

 
    if (CurrentGameComponent) {
      return <CurrentGameComponent />;
    }
    return <div>Тоглоом олдсонгүй!</div>;
  }

  return (
    <div className="min-h-screen bg-white p-2 flex flex-col items-center">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
         
      
          </div>
        </div>
        <div className="max-w-sm mx-auto">
          <RoomInfoCard />
        <div className="text-center">
        
          <p className="text-sm italic text-purple-500">
            Жич: Зөвхөн <span className="font-bold text-purple-800">Босс</span> л тоглоомоо сонгоно сорри 🙏
          </p>
        </div>
            
             
          <PlayerCardGeneral />
        </div>
        <div className="text-center mb-4">
          <div className="grid grid-cols-1 gap-3 max-w-sm mx-auto">
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
      <button
              // onClick={handleLeaveRoom}
              className="flex items-center gap-1 text-purple-700 hover:text-purple-800 font-medium transition-colors bg-purple-100/50 hover:bg-purple-100/80 px-2 py-1 rounded-full backdrop-blur-sm border border-purple-200 text-xs sm:text-sm"
            >
              <LogOut size={14} />
              Өрөөнөөс гарах
            </button>
        <div className="mt-6 flex justify-center space-x-3">
          {["red", "yellow", "purple"].map((color, idx) => (
            <div
              key={idx}
              className={`w-4 h-4 bg-${color}-400 rounded-full animate-bounce opacity-60`}
              style={{ animationDelay: `${idx * 0.2}s` }}
            ></div>
          ))}
        </div>

      </div>
    </div>
  );
};