"use client";

import React, {
  useState,
  useContext,
  useEffect,
  ChangeEvent,
  FormEvent,
} from "react";

import { useRouter } from "next/navigation";
import { SquareArrowLeft } from "lucide-react";
import { RoomContext } from "@/context/roomContextTest";
import { motion, Variants } from "framer-motion";

interface ExcuseFormProps {
  onSuccess?: () => void;
}

export const ExcuseForm: React.FC<ExcuseFormProps> = () => {
  const router = useRouter();
  const data = useContext(RoomContext);
  const roomCode = data?.roomData?.roomCode;
  const socket = data?.socket;
  const playerName = data?.playerName;

  const [reason, setReason] = useState("");
  const [allReasons, setAllReasons] = useState<
    { socketId: string; reason: string }[]
  >([]);
  const [timer, setTimer] = useState<number | null>(null);
  const [roast, setRoast] = useState<string | null>(null);

  const backLobby = () => {
    if (!data?.roomData || !playerName) return;
    router.push(
      `/lobby?roomCode=${data.roomData.roomCode}&playerName=${playerName}`
    );
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setReason(e.target.value);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!reason.trim() || !roomCode) return;
    socket?.emit("roast:submit_reason", { roomCode, reason });
    setReason("");
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("roast:reason_submitted", (player) => {
      setAllReasons((prev) => [...prev, player]);
    });

    socket.on("roast:timer_update", (time: number) => setTimer(time));

    socket.on("roast:timer_finished", () => setTimer(0));

    socket.on("roast:result", ({ roast }) => {
      setRoast(roast);
    });

    return () => {
      socket.off("roast:reason_submitted");
      socket.off("roast:timer_update");
      socket.off("roast:timer_finished");
      socket.off("roast:result");
    };
  }, [socket]);

  const roastVariants: Variants = {
    hidden: { y: "100%", opacity: 0, scale: 0.8 },
    visible: {
      y: "0%",
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        delay: 0.2,
      },
    },
    exit: { y: "100%", opacity: 0, scale: 0.8 },
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full p-3 border rounded-xl resize-none h-24"
          placeholder="Шалтагаа кирилээр бичээрэй хө.."
          value={reason}
          onChange={handleChange}
          disabled={timer === 0}
        />
        <button
          type="submit"
          disabled={!reason.trim() || timer === 0}
          className="w-full bg-violet-500 text-white py-2 rounded-xl"
        >
          Илгээх
        </button>
      </form>

      {timer !== null && timer > 0 && (
        <p className="text-center mt-2">⏳ Үлдсэн хугацаа: {timer} сек</p>
      )}

      {allReasons.length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold ">Илгээсэн шалтгаанууд:</h3>
          <ul className="list-disc list-inside">
            {allReasons.map((p, idx) => (
              <li key={idx}>
                <span className="font-semibold text-violet-600">{}</span>{" "}
                {p.reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {roast && (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-center z-50 p-4"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={roastVariants}
          style={{ backdropFilter: "blur(8px)" }}
        >
          <div className="flex items-center gap-2 w-full max-w-xs sm:max-w-md mb-6 relative z-50">
            <div className="relative p-[2px] rounded-md bg-gradient-to-br from-violet-400 via-pink-400 to-indigo-400">
              <button
                className="bg-violet-300 hover:bg-violet-400 px-4 py-2 rounded-md text-white flex items-center justify-center relative z-10"
                onClick={backLobby}
              >
                <SquareArrowLeft />
              </button>
            </div>
            <span className="text-sm text-violet-800">
              Дууссан бол энд дарна уу
            </span>
          </div>

          <div className="relative z-10 text-center p-8 bg-gradient-to-r from-violet-50 to-pink-50 dark:from-violet-900/20 dark:to-pink-900/20 rounded-2xl border-2 border-violet-200 dark:border-violet-700 shadow-lg max-w-md w-full">
            <div className="text-6xl mb-4">🤖</div>{" "}
            <h2 className="text-2xl font-bold text-violet-700 dark:text-violet-300 mb-2">
              AI Рөүст:
            </h2>
            <div className="text-xl font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 px-6 py-3 rounded-full shadow-md">
              {roast}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
