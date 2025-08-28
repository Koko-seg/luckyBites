"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ExcuseBackground } from "@/components/excuseBackground"

interface CreateRoomFormProps {
  onRoomCreated?: (room: {
    roomName: string
    roomCode: string
    roomId: number
  }) => void
}

export default function CreateRoom({ onRoomCreated }: CreateRoomFormProps) {
  const router = useRouter()
  const [roomName, setRoomName] = useState("")
  const [hostNickname, setHostNickname] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleCreateRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage("") 

    try {
      const response = await fetch("http://localhost:4200/room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomName, hostNickname }),
      })

      const data = await response.json()
      console.log("aslkdjjk",data);
      

      if (!response.ok) {
        throw new Error(data.message || "Өрөө үүсгэхэд алдаа гарлаа")
      }

   if (onRoomCreated) {
  onRoomCreated({
    roomName: data.roomName,
    roomCode: data.roomCode,
    roomId: data.roomId,
  })
}

    router.push(`/lobby?roomId=${data.roomId}&playerId=${data.hostPlayerId}`)

    } catch (err: any) {
      setErrorMessage(err.message || "Алдаа гарлаа")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex items-center justify-center p-4 overflow-hidden min-h-1/2 bg-gradient-to-brsm:p-6 lg:p-8">
      <ExcuseBackground />

      <form
        className="bg-white p-8 w-full max-w-md rounded-xl shadow-lg relative z-10 animate-fade-in-up animate-duration-700 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
        onSubmit={handleCreateRoom}
      >
        <div className="items-center mb-8 text-center">
          <h1 className="mb-2 text-4xl font-black text-green-300 transition-transform duration-300 transform sm:text-6xl lg:text-7xl xl:text-8xl sm:mb-4 drop-shadow-2xl -rotate-2 animate-fade-in-left animate-duration-800 animate-delay-200 hover:scale-110">
            Өрөө
          </h1>
          <h1 className="mb-2 text-4xl font-black text-yellow-400 transition-transform duration-300 transform sm:text-6xl lg:text-7xl xl:text-8xl drop-shadow-2xl rotate-1 animate-fade-in-right animate-duration-800 animate-delay-400 hover:scale-110">
            Үүсгэх
          </h1>
        </div>

        <input
          type="text"
          placeholder="Өрөөний нэр"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          className="w-full mb-4 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 transform focus:scale-[1.02] hover:border-blue-300 animate-fade-in-up animate-duration-600 animate-delay-600"
        />

        <input
          type="text"
          placeholder="Нэрээ оруулна уу (Host)"
          value={hostNickname}
          onChange={(e) => setHostNickname(e.target.value)}
          className="w-full mb-6 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 transform focus:scale-[1.02] hover:border-blue-300 animate-fade-in-up animate-duration-600 animate-delay-700"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 mb-6 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] animate-fade-in-up animate-duration-600 animate-delay-800 relative overflow-hidden group"
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
            </div>
          )}

          <span className={`transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}>
            {isLoading ? "Үүсгэж байна..." : "Өрөө Үүсгэх"}
          </span>

          <div className="absolute inset-0 transition-opacity duration-300 bg-white opacity-0 group-hover:opacity-10"></div>
        </button>

        {errorMessage && (
          <div
            className="bg-red-100 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded-lg mt-4 animate-fade-in-up animate-duration-500 transform hover:scale-[1.01] transition-transform duration-200"
            role="alert"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 w-5 h-5 mr-2">
                <svg className="w-full h-full animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <strong className="font-bold">Алдаа гарлаа! </strong>
                <span className="block sm:inline">{errorMessage}</span>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
