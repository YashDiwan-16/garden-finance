// src/components/ParallaxBackground.tsx
import React, { useEffect, useRef } from "react";

const ParallaxBackground: React.FC = () => {
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!backgroundRef.current) return;

      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      const moveX = ((clientX - innerWidth / 2) / innerWidth) * 20;
      const moveY = ((clientY - innerHeight / 2) / innerHeight) * 20;

      backgroundRef.current.style.transform = `translate(${-moveX}px, ${-moveY}px)`;
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
      <div
        ref={backgroundRef}
        className="absolute inset-[-20px] bg-cover bg-center transition-transform duration-200 ease-out"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1490750967868-88aa4486c946?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')`,
        }}
      ></div>
    </div>
  );
};

export default ParallaxBackground;
