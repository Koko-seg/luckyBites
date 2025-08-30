// import { Car, IceCream, Pizza, Star, Sun, ToyBrick, Users } from "lucide-react";

// export const IconBackground = () => {
//   const icons = [Car, Pizza, Star, Users, IceCream, ToyBrick, Sun];

//   // ✅ JoinRoom компонентын загвартай нийцсэн өнгөний палитр
//   const iconColors = ["text-violet-700", "text-orange-600", "text-violet-400"];

//   const gridSize = 10;
//   const iconSize = 48; // px

//   return (
//     <div
//       className="absolute inset-0 z-0 overflow-hidden opacity-5"
//       style={{
//         display: "grid",
//         gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
//         gridTemplateRows: `repeat(${gridSize}, 1fr)`,
//         gap: "2rem",
//       }}
//     >
//       {[...Array(gridSize * gridSize)].map((_, i) => {
//         const Icon = icons[i % icons.length];
//         const colorClass = iconColors[i % iconColors.length]; // ✅ Энд өнгөний циклийг ашигласан
//         return (
//           <div
//             key={i}
//             className={`flex items-center justify-center ${colorClass}`}
//           >
//             <Icon size={iconSize} />
//           </div>
//         );
//       })}
//     </div>
//   );
// };
import { Car, IceCream, Pizza, Star, Sun, ToyBrick, Users } from "lucide-react";

export const IconBackground = () => {
  const icons = [Car, Pizza, Star, Users, IceCream, ToyBrick, Sun];

  const iconColors = ["text-violet-600", "text-yellow-400", "text-violet-300"];

  const gridSize = 10;
  const iconSize = 48; // px

  return (
    <div
      // ✅ "absolute"-г "fixed" болгон өөрчилсөн
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
