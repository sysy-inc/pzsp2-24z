import React from 'react';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const WeatherBackground: React.FC = () => {
  const particlesInit = async (engine: any) => {
    await loadFull(engine);
  };

  return (
    <div className="absolute inset-0">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            color: {
              value: "#87CEEB", 
            },
          },
          particles: {
            number: {
              value: 50,
            },
            color: {
              value: ["#FFFFFF", "#00A9FF"], 
            },
            shape: {
              type: "circle",
            },
            opacity: {
              value: 0.8,
            },
            size: {
              value: 8,
              random: true,
            },
            move: {
              enable: true,
              speed: 2,
              direction: "top",
              outModes: "out",
            },
          },
          interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: "repulse",
              },
            },
            modes: {
              repulse: {
                distance: 100,
              },
            },
          },
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-blue-400 via-blue-200 to-white opacity-60" />
    </div>
  );
};

export default WeatherBackground;
