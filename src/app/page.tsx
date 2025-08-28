
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-100 p-4">
  <WhiteDot/>

      <Header/>
   <div className="flex space-x-4 mb-8">


    <div className="space-y-4 sm:space-y-6">
          <ActionButton
            onClick={handleToggle}
            icon={<Plus className="w-full h-full" />}
            text="  Өрөө Үүсгэх"
            bgColor="bg-yellow-400"
            hoverColor="hover:bg-yellow-600"
            borderColor="bg-yellow-700"
            hoverBorderColor="group-hover:bg-yellow-800"
          />

          <ActionButton
            onClick={handleToggleJoin}
            icon={<Users className="w-full h-full" />}
            text="Өрөөнд Нэвтрэх"
            bgColor="bg-orange-400"
            hoverColor="hover:bg-orange-600"
            borderColor="bg-orange-700"
            hoverBorderColor="group-hover:bg-orange-800"
          />
        </div>

</div>

<AnimatedDotAll/>

    </div>


  );
};

export default Page;

{/* <div className="flex flex-col items-center justify-center min-h-screen bg-blue-400 p-4">
  <WhiteDot />

  <Header />

  <div className="flex space-x-4 mb-8">
    <div className="space-y-4 sm:space-y-6">
      <ActionButton
        onClick={handleToggle}
        icon={<Plus className="w-full h-full" />}
        text="Өрөө Үүсгэх"
        bgColor="bg-sky-400"
        hoverColor="hover:bg-sky-500"
        borderColor="bg-sky-600"
        hoverBorderColor="group-hover:bg-sky-700"
      />

      <ActionButton
        onClick={handleToggleJoin}
        icon={<Users className="w-full h-full" />}
        text="Өрөөнд Нэвтрэх"
        bgColor="bg-indigo-400"
        hoverColor="hover:bg-indigo-500"
        borderColor="bg-indigo-600"
        hoverBorderColor="group-hover:bg-indigo-700"
      />
    </div>
  </div>

  <AnimatedDotAll />
</div> */}