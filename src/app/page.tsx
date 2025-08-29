"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { AnimatedDotAll } from "@/components/AnimatedDot";
import ActionButton from "@/components/ActionButton";
import { Plus, Users } from "lucide-react";
import { WhiteDot } from "@/components/WhiteDot";

const Page = () => {
  const router = useRouter();

  const [showCreateRoom, setShowCreateRoom] = useState(false);

  const handleToggle = () => {
    setShowCreateRoom(!showCreateRoom);
    router.push("/create-room");
  };

  const handleToggleJoin = () => {
    setShowCreateRoom(!showCreateRoom);
    router.push("/join-room");
  };

  return (
    <div className="flex flex-col items-center justify-center  min-h-screen bg-white p-4">
      <WhiteDot />

      <Header />
      <div className="flex space-x-4 mb-8">
        <div className="space-y-4 sm:space-y-6">
          <ActionButton
            onClick={handleToggle}
            icon={<Plus className="w-full h-full" />}
            text="  Өрөө Үүсгэх"
            textColor="text-white"
            bgColor=" bg-violet-600"
            hoverColor="hover:bg-violet-700"
            borderColor="bg-violet-800"
            hoverBorderColor="group-hover:bg-violet-900"
          />

          <ActionButton
            onClick={handleToggleJoin}
            icon={<Users className="w-full h-full" />}
            text="Өрөөнд Нэвтрэх"
            bgColor="bg-white"
            textColor="text-violet-600"
            hoverColor="hover:bg-white"
            borderColor="bg-white"
            hoverBorderColor="group-hover:bg-white"
          />
        </div>
      </div>

      <AnimatedDotAll />
    </div>
  );
};

export default Page;
<div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
  {/* Icon/Logo */}
  <div className="w-40 h-40 bg-purple-600 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
    {/* You would replace this with your actual SVG or image */}
    <div className="w-24 h-24 bg-purple-400 rounded-full flex items-center justify-center">
      <div className="w-12 h-12 bg-white rounded-full"></div>
    </div>
  </div>

  {/* App Name */}
  <h1 className="text-4xl font-semibold mb-10">Elingo</h1>

  {/* Loading Spinner */}
  <div className="w-16 h-16 relative">
    <div className="w-16 h-16 border-8 border-purple-400 border-dotted rounded-full animate-spin"></div>
    <div className="w-4 h-4 bg-purple-400 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
  </div>
</div>;
