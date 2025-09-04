import { motion, useInView, useAnimation } from "framer-motion";
import { useEffect, useRef, useContext } from "react";
import { LogOut } from "lucide-react";

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
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.1 });
  const controls = useAnimation();
  const data = useContext(RoomContext);
  const { roomData, socket, playerName } = data || {};
  const router = useRouter();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [isInView, controls]);

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
      description: "Гэхдээ ухаанаараа биш шүү хэхэ",
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
      router.push("/");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
      },
    },
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

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="w-full"
        >
          {games.map((game) => (
            <motion.div key={game.id} variants={itemVariants} className="mb-4">
              <GameButton
                game={game}
                canStart={canStart}
                selectedGame={selectedGame}
              />
            </motion.div>
          ))}
        </motion.div>

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
