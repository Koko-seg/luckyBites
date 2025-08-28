import Lottie from "lottie-react"
import globeAnimation from "@/animation/Donut.json"

export const Header = ()=> {
    return (
           <div className="mb-8 sm:mb-12 text-center">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black  text-violet-800 mb-2 sm:mb-4 drop-shadow-2xl animate-bounce delay-500 transform -rotate-2">
        LUCKY
          </h1>
         <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-gray-300 mb-2 drop-shadow-2xl transform rotate-1 animate-pulse">
  BITES
</h1>

         
          <div className="relative w-64 h-64 md:w-80 md:h-80">
                <Lottie
                  animationData={globeAnimation}
                  loop={true}
                  className="absolute inset-0 text-purple-500"
                />
              </div>
        
        </div>
    )
}