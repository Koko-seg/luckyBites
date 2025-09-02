import { Car, IceCream, Pizza, Star, Sun, ToyBrick, Users } from "lucide-react";

export const IconBackground = () => {
  const icons = [Car, Pizza, Star, Users, IceCream, ToyBrick, Sun];

  const iconColors = ["text-violet-600", "text-yellow-400", "text-violet-300"];

  const gridSize = 10;
  const iconSize = 48; // px

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden opacity-5"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        gridTemplateRows: `repeat(${gridSize}, 1fr)`,
        gap: "2rem",
      }}
    >
      {[...Array(gridSize * gridSize)].map((_, i) => {
        const Icon = icons[i % icons.length];
        const colorClass = iconColors[i % iconColors.length];
        return (
          <div
            key={i}
            className={`flex items-center justify-center ${colorClass}`}
          >
            <Icon size={iconSize} />
          </div>
        );
      })}
    </div>
  );
};
