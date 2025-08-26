
"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";



const Page = () => {
const router = useRouter();

  const [showCreateRoom, setShowCreateRoom] = useState(false);

  const handleToggle = () => {
    setShowCreateRoom(!showCreateRoom);
    router.push("/CreateRoom");
  };

  const handleToggleJoin = () => {
    setShowCreateRoom(!showCreateRoom);
    router.push("/JoinRoom");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="flex space-x-4 mb-8">
        <Button
          onClick={handleToggle}
          className={`px-6 py-2 rounded-lg transition-colors ${
            showCreateRoom
              ? "bg-blue-600 text-white"
              : "bg-gray-300 text-gray-800 hover:bg-gray-400"
          }`}
        >
          Өрөө Үүсгэх
        </Button>
        <Button
          onClick={handleToggleJoin}
          className={`px-6 py-2 rounded-lg transition-colors ${
            !showCreateRoom
              ? "bg-blue-600 text-white"
              : "bg-gray-300 text-gray-800 hover:bg-gray-400"
          }`}
        >
          Өрөөнд Нэвтрэх
        </Button>
      </div>

    </div>
  );
};

export default Page;
