// import React, { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import io, { Socket } from "socket.io-client";

// interface RoomDataContext {
//   roomCode: string;
//   host: string | null;
//   players: string[];
//   roomName: string;
// }
// let socket: Socket;

// const RoomContext = React.createContext<RoomDataContext | null>(null);

// export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const searchParams = useSearchParams();
//   const roomCode = searchParams.get("roomCode");
//   const playerName = searchParams.get("playerName"); // Get player's nickname from URL

//   const [roomData, setRoomData] = useState<RoomDataContext | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [errorMessage, setErrorMessage] = useState("");

//   useEffect(() => {
//     // Check if required parameters exist
//     if (!roomCode || !playerName) {
//       setErrorMessage("Өрөөний код эсвэл тоглогчийн нэр олдсонгүй.");
//       setLoading(false);
//       return;
//     }

//     // Connect to the socket server
//     socket = io("http://localhost:4200");

//     // Listen for room data updates from the server
//     socket.on("roomData", (data: RoomDataContext) => {
//       if (data.roomCode !== roomCode) return;
//       // The line below was causing the issue and has been removed.
//       // if (!data.players.length) return;

//       setRoomData(data);
//       setLoading(false);
//     });

//     // Listen for join errors
//     socket.on("joinError", ({ message }) => {
//       const errorText =
//         typeof message === "object" ? JSON.stringify(message) : message;
//       setErrorMessage(errorText);
//       setLoading(false);
//     });

//     // Emit the joinRoom event with the actual player name
//     socket.emit("joinRoom", { roomCode, playerName });

//     // Clean-up function to disconnect the socket when the component unmounts
//     return () => {
//       socket.disconnect();
//     };
//   }, [roomCode, playerName]); // Dependencies are now correct
//   return (
//     <RoomContext.Provider value={roomData}>
//       {loading ? (
//         <div>Лобби ачааллаж байна...</div>
//       ) : errorMessage ? (
//         <div>Алдаа гарлаа: {errorMessage}</div>
//       ) : roomData?.players?.length === 0 ? (
//         <div>no player</div>
//       ) : (
//         children
//       )}
//     </RoomContext.Provider>
//   );

//   if (loading) {
//     return <div>Лобби ачааллаж байна...</div>;
//   }

//   if (errorMessage) {
//     return <div>Алдаа гарлаа: {errorMessage}</div>;
//   }

//   if (roomData?.players?.length === 0) {
//     return <div>no player</div>;
//   }
// };
