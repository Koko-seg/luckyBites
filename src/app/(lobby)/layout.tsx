import { RoomProvider } from "@/context/roomContextTest";

export default function LobbyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <RoomProvider>{children}</RoomProvider>
    </div>
  );
}
