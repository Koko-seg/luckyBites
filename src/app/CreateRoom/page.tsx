"use client";

import BackgroundAnimation from "@/components/backgroundAnimation";
import CreateRoom from "./component/CreateRoom";

const Page = () => {
  return (
    <div className="relative flex items-center justify-center z-10 min-h-screen">
      <div className="absolute inset-0 ">
        <BackgroundAnimation />
      </div>
      <div className="flex items-center justify-center z-10 relative">
        <CreateRoom />
      </div>
    </div>
  );
};

export default Page;
