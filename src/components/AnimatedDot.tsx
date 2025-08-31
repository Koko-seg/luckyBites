import AnimatedDot from "./BackgroundDot";
export const AnimatedDotAll = () => {
  return (
    <div className="mt-8 sm:mt-12 flex justify-center space-x-2 sm:space-x-4">
      <AnimatedDot color="bg-purple-600" delay="0ms" />
      <AnimatedDot color="bg-green-400" delay="200ms" />
      <AnimatedDot color="bg-yellow-300" delay="400ms" />
      <AnimatedDot color="bg-blue-400" delay="400ms" />
    </div>
  );
};
