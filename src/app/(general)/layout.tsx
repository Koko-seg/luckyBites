import { RoomProvider } from "@/context/roomContextTest";
import { Suspense } from "react";

export default function LobbyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RoomProvider>{children}</RoomProvider>
    </Suspense>
  );
}
