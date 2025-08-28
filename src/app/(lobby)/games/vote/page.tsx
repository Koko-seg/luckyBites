"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";
import { FaUser, FaTrophy } from "react-icons/fa";

const socket = io("http://localhost:4200"); // backend url

export default function VoteGamePage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [question, setQuestion] = useState<string | null>(null);
  const [votes, setVotes] = useState<any>({});
  const [roundResult, setRoundResult] = useState<any>(null);
  const [isHost, setIsHost] = useState(false);
  const [gameOver, setGameOver] = useState<any>(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting'); // Debug connection

  useEffect(() => {
    // Connection status tracking
    socket.on('connect', () => {
      console.log('Connected to server');
      setConnectionStatus('connected');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnectionStatus('disconnected');
    });

    socket.emit("autoJoin", (res: any) => {
      console.log('autoJoin response:', res); // Debug log
      setPlayers(res.players);

      // Хэрэв join хийж буй socket.id хамгийн эхний тоглогч бол host
      if(res.players[0] && res.players[0].id === socket.id) {
        setIsHost(true);
      }
    });

    socket.on("roomUpdate", (room) => {
      console.log('Room updated:', room); // Debug log
      setPlayers(room.players);
      
      // Host статусыг шинэчлэх - хамгийн эхний тоглогч байвал host
      if(room.players.length > 0 && room.players[0].id === socket.id) {
        setIsHost(true);
      } else {
        setIsHost(false);
      }
    });

    socket.on("newQuestion", (q) => {
      setQuestion(q);
      setVotes({});
      setRoundResult(null);
    });

    socket.on("voteUpdate", (v) => {
      setVotes(v);
    });

    socket.on("roundResult", (res) => {
      setRoundResult(res);
    });

    socket.on("gameOver", (res) => {
      setGameOver(res);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("roomUpdate");
      socket.off("newQuestion");
      socket.off("voteUpdate");
      socket.off("roundResult");
      socket.off("gameOver");
    };
  }, []);

  const startQuestion = () => {
    socket.emit("startQuestion", "GAME");
  };

  const vote = (id: string) => {
    socket.emit("vote", { code: "GAME", votedId: id });
  };

  // Sort players by score (highest first)
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
        <h1 className="text-4xl font-bold text-purple-600 drop-shadow-lg text-center">
          Хамгийн тодруулах тоглоом 🎯
        </h1>

        {/* Connection Status Debug */}
        <div className="bg-gray-100 px-4 py-2 rounded-lg text-sm">
          Холболт: {connectionStatus} | Тоглогчдын тоо: {players.length}
        </div>

        {/* Онооны самбар */}
        <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-2xl border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-700 text-center flex items-center justify-center gap-2">
            <FaTrophy className="text-yellow-500" />
            Онооны самбар
          </h2>
          
          {players.length > 0 ? (
            <div className="space-y-3">
              {sortedPlayers.map((player, index) => (
                <div
                  key={`${player.id}-${index}`} // Combine player.id with index for unique key
                  className={`
                    flex items-center justify-between p-4 rounded-xl shadow-sm border-2 transition-all
                    ${index === 0 && player.score > 0 
                      ? 'bg-yellow-50 border-yellow-300' 
                      : 'bg-gray-50 border-gray-200'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                      ${index === 0 && player.score > 0 
                        ? 'bg-yellow-500 text-white' 
                        : 'bg-purple-500 text-white'
                      }
                    `}>
                      {index + 1}
                    </div>
                    <FaUser className="text-purple-400" />
                    <span className="font-semibold text-gray-700">
                      {player.name}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-bold">
                      {player.score} оноо
                    </span>
                    {index === 0 && player.score > 0 && (
                      <FaTrophy className="text-yellow-500 text-lg" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">Тоглогчид орохыг хүлээж байна...</p>
          )}
        </div>

        {/* Game Content */}
        {gameOver ? (
          <div className="text-center bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
            <h2 className="text-3xl font-bold text-green-600 mb-6">
              Тоглоом дууслаа 🎉
            </h2>
            <p className="font-medium text-gray-700 mb-4 text-lg">Ялагчид:</p>
            <div className="space-y-2">
              {gameOver.winners.map((winner: any, index: number) => (
                <div key={`winner-${winner.id}-${index}`} className="text-xl font-bold text-purple-500 flex items-center justify-center gap-2">
                  <FaTrophy className="text-yellow-500" />
                  {winner.name}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {question ? (
              <div className="text-center bg-white rounded-2xl p-8 shadow-xl border border-gray-200 w-full max-w-2xl">
                <h2 className="text-2xl font-bold text-blue-600 mb-6">
                  {question}
                </h2>

                {/* Санал өгөх товчнууд */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {players.map((player, index) => (
                    <button
                      key={`vote-${player.id}-${index}`} // Unique key for voting buttons
                      onClick={() => vote(player.id)}
                      className="bg-white border-2 border-blue-300 hover:bg-blue-100 hover:border-blue-500 text-blue-700 font-semibold px-4 py-3 rounded-xl shadow transition-all hover:shadow-md"
                    >
                      {player.name}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // Host эсэхийг шалгах (тоглогчид байгаа үед л)
              players.length > 0 && isHost && (
                <div className="text-center">
                  <button
                    onClick={startQuestion}
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all text-lg"
                  >
                    Тоглоом эхлүүлэх 🚀
                  </button>
                  <p className="mt-2 text-sm text-gray-600">
                    Та энэ өрөөний host байна
                  </p>
                </div>
              )
            )}

            {/* Дүн гарсны дараа */}
            {roundResult && (
              <div className="mt-6 text-center bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
                {roundResult.winner ? (
                  <p className="text-xl font-bold text-green-600 mb-4">
                    🏆 {roundResult.winner.name} оноо авлаа!
                  </p>
                ) : (
                  <p className="text-xl font-bold text-red-500 mb-4">
                    ✨ Тэнцсэн тул оноо олгосонгүй
                  </p>
                )}

                {roundResult && isHost && !gameOver && (
                  <button
                    onClick={startQuestion}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold"
                  >
                    Дараагийн асуулт →
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}