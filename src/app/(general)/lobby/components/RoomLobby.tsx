import { LogOut } from "lucide-react";

import { useContext } from "react";
import { PlayerCardGeneral } from "./PlayerCardGeneral";
import { RoomInfoCard } from "./RoomInfoCard";
import { RoomContext } from "@/context/roomContextTest";
import ExcuseCard from "@/app/(general)/games/excuse/components/ExcuseCard";
import { GameButton } from "./GameButton";
import SpinWheelPage from "../../games/spin/page";
import Lottie from "lottie-react";
import globeAnimation from "@/animation/Loading Dots In Yellow.json";
import { AnimatedDotAll } from "@/components/AnimatedDot";
import RunnerGame from "../../games/runnerGame/components/RunnerGame";
import { useRouter } from "next/navigation";

export const RoomLobby = () => {
  const data = useContext(RoomContext);
  // const { roomData } = data || {};
  const { roomData, socket, playerName } = data || {};

  const router = useRouter();

  if (!roomData) {
    return (
      <div className="relative w-64 h-64 md:w-80 md:h-80">
        <Lottie
          animationData={globeAnimation}
          loop={true}
          className="absolute inset-0 text-purple-500"
        />
      </div>
    );
  }

  const games = [
    {
      id: "excuse",
      name: "Шалтаг тоочих уу?",
      component: ExcuseCard,
      description: "Хэн нь сайн шалтаг тоочих вэ?",
      icon: "/word-of-mouth.png",
      color: "bg-purple-500",
      textColor: "text-white",
    },
    {
      id: "spin",
      name: "Азаа үзэх үү?",
      component: SpinWheelPage,
      description: "Өнөөдөр азтай өдөр чинь байх болов уу даа.",
      icon: "/spin.png",
      color: "bg-orange-500",
      textColor: "text-white",
    },
    {
      id: "runnerGame",
      name: "Уралдах уу?",
      component: RunnerGame,
      description: "Гэхдээ ухаанаараа биш шүү.",
      icon: "/snail.png",
      color: "bg-blue-500",
      textColor: "text-white",
    },
  ];

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
  const handleLeaveRoom = () => {
    if (socket && playerName && roomData.roomCode) {
      socket.emit("leaveRoom", {
        roomCode: roomData.roomCode,
        playerName: playerName,
      });
      router.push("/"); // Хэрэглэгчийг үндсэн хуудас руу шилжүүлнэ
    }
  };
  return (
    <div className="min-h-screen bg-white p-2 flex flex-col items-center">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1"></div>
        </div>
        <div className="max-w-sm mx-auto">
          <RoomInfoCard />
          <div className="text-center">
            <p className="text-sm italic text-purple-500">
              Жич: Зөвхөн{" "}
              <span className="font-bold text-purple-800">Босс</span> л
              тоглоомоо сонгоно сорри 🙏
            </p>
          </div>

          <PlayerCardGeneral />
        </div>
        {games.map((game) => (
          <GameButton
            key={game.id}
            game={game}
            canStart={canStart}
            selectedGame={selectedGame}
          />
        ))}
        <div className="w-full mt-8 flex">
          <button
            onClick={handleLeaveRoom}
            className="flex items-center gap-1 text-purple-700 hover:text-purple-800 font-medium transition-colors bg-purple-100/50 hover:bg-purple-100/80 px-2 py-1 rounded-full backdrop-blur-sm border border-purple-200 text-xs sm:text-sm"
          >
            <LogOut size={14} />
            Өрөөнөөс гарах
          </button>
        </div>
        <AnimatedDotAll />
      </div>
    </div>
  );
};
