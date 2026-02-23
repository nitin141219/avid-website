// "use client";

// import { AnimatePresence, motion } from "framer-motion";
// import { useEffect, useState } from "react";

// interface Particle {
//   id: number;
//   x: number;
//   y: number;
//   size: number;
//   opacity: number;
//   color: string;
// }

// export default function Cursor() {
//   const [particles, setParticles] = useState<Particle[]>([]);
//   // const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       // setMousePosition({ x: e.clientX, y: e.clientY });

//       // Create new particle
//       const newParticle: Particle = {
//         id: Date.now() + Math.random(),
//         x: e.clientX,
//         y: e.clientY,
//         size: Math.random() * 8 + 4,
//         opacity: 1,
//         color: `hsl(${Math.random() * 360}, 70%, 60%)`,
//       };

//       setParticles((prev) => [...prev, newParticle]);

//       // Remove old particles after animation
//       setTimeout(() => {
//         setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
//       }, 1000);
//     };

//     window.addEventListener("mousemove", handleMouseMove);
//     return () => window.removeEventListener("mousemove", handleMouseMove);
//   }, []);

//   return (
//     <div className="z-50 fixed inset-0 pointer-events-none">
//       {/* Main cursor dot */}
//       {/* <motion.div
//         className="absolute bg-white rounded-full w-4 h-4 mix-blend-difference"
//         animate={{
//           x: mousePosition.x - 8,
//           y: mousePosition.y - 8,
//         }}
//         transition={{
//           type: "spring",
//           stiffness: 500,
//           damping: 28,
//           mass: 0.5,
//         }}
//       /> */}

//       {/* Cursor ring */}
//       {/* <motion.div
//         className="absolute border-2 border-white rounded-full w-8 h-8 mix-blend-difference"
//         animate={{
//           x: mousePosition.x - 16,
//           y: mousePosition.y - 16,
//         }}
//         transition={{
//           type: "spring",
//           stiffness: 150,
//           damping: 15,
//           mass: 0.1,
//         }}
//       /> */}

//       {/* Particles */}
//       <AnimatePresence>
//         {particles.map((particle) => (
//           <motion.div
//             key={particle.id}
//             className="absolute rounded-full"
//             style={{
//               width: particle.size,
//               height: particle.size,
//               backgroundColor: particle.color,
//               left: particle.x - particle.size / 2,
//               top: particle.y - particle.size / 2,
//             }}
//             initial={{
//               scale: 0,
//               opacity: particle.opacity,
//             }}
//             animate={{
//               scale: [0, 1, 0],
//               opacity: [0.8, 0.6, 0],
//               x: [0, (Math.random() - 0.5) * 100],
//               y: [0, (Math.random() - 0.5) * 100],
//             }}
//             exit={{
//               scale: 0,
//               opacity: 0,
//             }}
//             transition={{
//               duration: 1,
//               ease: "easeOut",
//             }}
//           />
//         ))}
//       </AnimatePresence>

//       {/* Trailing particles */}
//       <AnimatePresence>
//         {particles.slice(-5).map((particle, index) => (
//           <motion.div
//             key={`trail-${particle.id}`}
//             className="absolute bg-blue-400 opacity-30 rounded-full w-2 h-2"
//             style={{
//               left: particle.x - 4,
//               top: particle.y - 4,
//             }}
//             initial={{ scale: 0, opacity: 0.5 }}
//             animate={{
//               scale: [1, 0],
//               opacity: [0.5, 0],
//             }}
//             transition={{
//               duration: 0.5,
//               delay: index * 0.1,
//             }}
//           />
//         ))}
//       </AnimatePresence>
//     </div>
//   );
// }

// "use client";

// import { motion } from "framer-motion";
// import { useEffect, useState } from "react";

// type Particle = {
//   id: number;
//   x: number;
//   y: number;
//   color: string;
// };

// export default function ParticleCursor() {
//   const [particles, setParticles] = useState<Particle[]>([]);

//   const handleMouseMove = (e: MouseEvent) => {
//     const newParticle: Particle = {
//       id: Date.now() + Math.random(), // ✅ unique every time
//       x: e.clientX,
//       y: e.clientY,
//       color: `hsl(${Math.random() * 360}, 100%, 70%)`,
//     };

//     // Keep the last 25 particles for performance
//     setParticles((prev) => [...prev.slice(-25), newParticle]);
//   };

//   const getRandom = () => {
//     return Math.random();
//   };

//   useEffect(() => {
//     window.addEventListener("mousemove", handleMouseMove);
//     return () => window.removeEventListener("mousemove", handleMouseMove);
//   }, []);

//   return (
//     <div className="fixed inset-0 pointer-events-none z-999">
//       {particles.map((p) => (
//         <motion.div
//           key={p.id}
//           initial={{
//             x: p.x,
//             y: p.y,
//             scale: 1,
//             opacity: 1,
//           }}
//           animate={{
//             x: p.x + (getRandom() - 0.5) * 40, // small random drift
//             y: p.y + (getRandom() - 0.5) * 40,
//             scale: 0,
//             opacity: 0,
//           }}
//           transition={{
//             duration: 0.6,
//             ease: "easeOut",
//           }}
//           className="absolute w-2 h-2 rounded-full"
//           style={{
//             backgroundColor: p.color,
//             left: 0,
//             top: 0,
//           }}
//         />
//       ))}
//     </div>
//   );
// }

"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Particle = {
  id: number;
  x: number;
  y: number;
  color: string;
  driftX: number;
  driftY: number;
};

export default function ParticleCursor() {
  const [particles, setParticles] = useState<Particle[]>([]);

  const handleMouseMove = (e: MouseEvent) => {
    const newParticle: Particle = {
      id: Date.now() + Math.random(), // unique id
      x: e.clientX,
      y: e.clientY,
      color: `hsl(${Math.random() * 360}, 100%, 70%)`,
      driftX: (Math.random() - 0.5) * 40, // drift precomputed safely
      driftY: (Math.random() - 0.5) * 40,
    };

    // Keep last 25 particles
    setParticles((prev) => [...prev.slice(-25), newParticle]);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-999">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            x: p.x,
            y: p.y,
            scale: 1,
            opacity: 1,
          }}
          animate={{
            x: p.x + p.driftX,
            y: p.y + p.driftY,
            scale: 0,
            opacity: 0,
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: p.color,
            left: 0,
            top: 0,
          }}
        />
      ))}
    </div>
  );
}
