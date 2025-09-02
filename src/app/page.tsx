"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { AnimatedDotAll } from "@/components/AnimatedDot";
import ActionButton from "@/components/ActionButton";
import { Plus, Users } from "lucide-react";
import { WhiteDot } from "@/components/WhiteDot";
import { IconBackground } from "@/components/IconBackground";

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
    <div className="flex flex-col items-center justify-center  min-h-screen bg-gradient-to-br from-orange-200 to-violet-100 p-4">
      <IconBackground />
      <WhiteDot />

      <Header />
      <div className="w-full text-gray-500 py-6 px-4 text-center ">
        <p className="text-lg md:text-xl font-semibold">
          Та төлбөр төлөхгүйгээр энд азаа сорих боломжтой!
        </p>
      </div>
      <div className="flex space-x-4 mb-8">
        <div className="space-y-4 sm:space-y-6">
          <ActionButton
            onClick={handleToggle}
            icon={<Plus className="w-full h-full" />}
            text="  Өрөө Үүсгэх"
            textColor="text-white"
            bgColor=" bg-orange-400"
            hoverColor="hover:bg-orange-400"
            borderColor="bg-violet-200"
            hoverBorderColor="group-hover:bg-orange-400"
          />

          <ActionButton
            onClick={handleToggleJoin}
            icon={<Users className="w-full h-full" />}
            text="Өрөөнд Нэвтрэх"
            bgColor="bg-white"
            textColor="text-violet-600"
            hoverColor="hover:bg-white"
            borderColor="bg-orange-100"
            hoverBorderColor="group-hover:bg-white"
          />
        </div>
      </div>

      <AnimatedDotAll />
    </div>
  );
};

export default Page;
