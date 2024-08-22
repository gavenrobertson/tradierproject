import './App.css';
import React from 'react';
import { useCallback, useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
// import { loadAll } from "@tsparticles/all"; // Uncomment if using `loadAll`
// import { loadFull } from "tsparticles"; // Uncomment if using `loadFull`
import { loadSlim } from "@tsparticles/slim"; // Ensure you have @tsparticles/slim installed
// import { loadBasic } from "@tsparticles/basic"; // Uncomment if using `loadBasic`

const ParticleBackground = React.memo(() => {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            // Initialize the particles engine with the features you need
            // await loadAll(engine); // Uncomment if using `loadAll`
            // await loadFull(engine); // Uncomment if using `loadFull`
            await loadSlim(engine); // Ensure to use the appropriate loader
            // await loadBasic(engine); // Uncomment if using `loadBasic`
        }).then(() => {
            setInit(true);
        });
    }, []);

    const particlesLoaded = useCallback((container) => {
        console.log(container);
    }, []);

    return (
        <div className="particle-background">
            {init && (
                <Particles
                    id="tsparticles"
                    particlesLoaded={particlesLoaded}
                    options={{
                        background: {
                            color: {
                                value: "#282c34",
                            },
                        },
                        fpsLimit: 120,
                        interactivity: {
                            events: {
                                onClick: {
                                    enable: true,
                                    mode: "push",
                                },
                                onHover: {
                                    enable: true,
                                    mode: "repulse",
                                },
                                resize: true,
                            },
                            modes: {
                                push: {
                                    quantity: 4,
                                },
                                repulse: {
                                    distance: 200,
                                    duration: 0.4,
                                },
                            },
                        },
                        particles: {
                            color: {
                                value: "#ffffff",
                            },
                            links: {
                                color: "#ffffff",
                                distance: 150,
                                enable: true,
                                opacity: 0.5,
                                width: 1,
                            },
                            move: {
                                direction: "none",
                                enable: true,
                                outModes: {
                                    default: "bounce",
                                },
                                random: false,
                                speed: 6,
                                straight: false,
                            },
                            number: {
                                density: {
                                    enable: true,
                                    area: 800,
                                },
                                value: 80,
                            },
                            opacity: {
                                value: 0.5,
                            },
                            shape: {
                                type: "circle",
                            },
                            size: {
                                value: { min: 1, max: 5 },
                            },
                        },
                        detectRetina: true,
                    }}
                />
            )}
        </div>
    );
});

export default ParticleBackground;