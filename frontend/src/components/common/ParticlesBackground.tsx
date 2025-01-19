import React from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

const ParticlesBackground: React.FC = () => {
  const particlesInit = async (main: any) => {
    await loadFull(main);
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fpsLimit: 60,
        particles: {
          number: {
            value: 50, 
            density: {
              enable: true,
              value_area: 800, 
            },
          },
          color: {
            value: "#ffffff", 
          },
          shape: {
            type: "circle", 
          },
          opacity: {
            value: 0.5,
            random: true,
          },
          size: {
            value: 3,
            random: true,
          },
          move: {
            enable: true,
            speed: 2,
            direction: "none",
            out_mode: "bounce", 
          },
        },
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "repulse", 
            },
            onClick: {
              enable: true,
              mode: "push", 
            },
          },
          modes: {
            repulse: {
              distance: 100, 
            },
            push: {
              quantity: 4, 
            },
          },
        },
        detectRetina: true, 
      }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1, 
      }}
    />
  );
};

export default ParticlesBackground;
