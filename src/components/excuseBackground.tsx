"use client"

export function ExcuseBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated floating shapes */}
      <div className="absolute w-20 h-20 rounded-full top-10 left-10 bg-white/10 animate-bounce animate-duration-3000 animate-delay-0"></div>
      <div className="absolute w-16 h-16 rounded-full top-32 right-16 bg-white/10 animate-bounce animate-duration-4000 animate-delay-1000"></div>
      <div className="absolute w-24 h-24 rounded-full bottom-20 left-20 bg-white/10 animate-bounce animate-duration-5000 animate-delay-2000"></div>
      <div className="absolute w-12 h-12 rounded-full bottom-32 right-10 bg-white/10 animate-bounce animate-duration-3500 animate-delay-500"></div>

      {/* Floating particles */}
      <div className="absolute w-2 h-2 rounded-full top-1/4 left-1/3 bg-white/20 animate-ping animate-duration-2000"></div>
      <div className="absolute w-3 h-3 rounded-full top-1/2 right-1/4 bg-white/20 animate-ping animate-duration-3000 animate-delay-1000"></div>
      <div className="absolute w-2 h-2 rounded-full bottom-1/3 left-1/4 bg-white/20 animate-ping animate-duration-2500 animate-delay-500"></div>

      {/* Subtle gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent animate-pulse animate-duration-4000"></div>
    </div>
  )
}
