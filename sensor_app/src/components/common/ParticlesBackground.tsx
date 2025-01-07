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
            value: 50, // Number of particles
            density: {
              enable: true,
              value_area: 800, // Density of particles in the viewport
            },
          },
          color: {
            value: "#ffffff", // Particle color
          },
          shape: {
            type: "circle", // Shape of particles
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
            out_mode: "bounce", // How particles behave when they hit edges
          },
        },
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "repulse", // Particles move away from the cursor
            },
            onClick: {
              enable: true,
              mode: "push", // Adds more particles on click
            },
          },
          modes: {
            repulse: {
              distance: 100, // How far particles repulse
            },
            push: {
              quantity: 4, // Number of particles added on click
            },
          },
        },
        detectRetina: true, // Improves particle resolution on high-DPI screens
      }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1, // Push the particles behind other content
      }}
    />
  );
};

export default ParticlesBackground;
