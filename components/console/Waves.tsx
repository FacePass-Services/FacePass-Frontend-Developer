import React, { useState, useEffect } from "react";

const Waves: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <section className="break w-full">
      <svg
        className="waves"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
        shapeRendering="auto"
      >
        <defs>
          <path
            id="gentle-wave"
            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
          />
        </defs>
        <g className="parallax">
          <use
            xlinkHref="#gentle-wave"
            x="48"
            y="0"
            fill={isDarkMode ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.7)"}
          />
          <use
            xlinkHref="#gentle-wave"
            x="48"
            y="3"
            fill={isDarkMode ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)"}
          />
          <use
            xlinkHref="#gentle-wave"
            x="48"
            y="5"
            fill={isDarkMode ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.3)"}
          />
          <use
            xlinkHref="#gentle-wave"
            x="48"
            y="7"
            fill={isDarkMode ? "#000" : "#fff"}
          />
        </g>
      </svg>
    </section>
  );
};

export default Waves;
