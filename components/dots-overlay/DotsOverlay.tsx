"use client";

import React, { ReactNode } from "react";

interface DotsOverlayProps {
  children?: ReactNode;
  className?: string;
  opacity?: number;
}

const DotsOverlay: React.FC<DotsOverlayProps> = ({ children, className, opacity = 0.2 }) => {
  return (
    <div className={`w-full h-full relative z-0 ${className || ""}`}>
      <div
        className="absolute inset-0 w-full h-full -z-1"
        style={{
          backgroundImage: "url('/bg-pattern1.png')",
          backgroundRepeat: "repeat",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          opacity: opacity || 0.2,
        }}
      />
      {children}
    </div>
  );
};

export default DotsOverlay;
