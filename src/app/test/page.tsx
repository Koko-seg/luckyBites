// "use client";

// import CreateRoomForm from "./component/CreateRoom";
// import JoinRoom from "./component/JoinRoom";

// const Page = () => {
//   return (
//     <div>
//       <CreateRoomForm />
//       <JoinRoom />
//     </div>
//   );
// };

// export default Page;
"use client";

import { useState } from "react";
import CreateRoomForm from "./component/CreateRoom";
import JoinRoom from "./component/JoinRoom";
import { Button } from "@/components/ui/button";

const Page = () => {
  const [showCreateRoom, setShowCreateRoom] = useState(false);

  const handleToggle = () => {
    setShowCreateRoom(!showCreateRoom);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="flex space-x-4 mb-8">
        <Button
          onClick={() => setShowCreateRoom(true)}
          className={`px-6 py-2 rounded-lg transition-colors ${
            showCreateRoom
              ? "bg-blue-600 text-white"
              : "bg-gray-300 text-gray-800 hover:bg-gray-400"
          }`}
        >
          Өрөө Үүсгэх
        </Button>
        <Button
          onClick={() => setShowCreateRoom(false)}
          className={`px-6 py-2 rounded-lg transition-colors ${
            !showCreateRoom
              ? "bg-blue-600 text-white"
              : "bg-gray-300 text-gray-800 hover:bg-gray-400"
          }`}
        >
          Өрөөнд Нэвтрэх
        </Button>
      </div>

      {showCreateRoom ? <CreateRoomForm /> : <JoinRoom />}
    </div>
  );
};

export default Page;
