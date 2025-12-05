'use client';

import { useEffect, useMemo, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { ISourceOptions } from '@tsparticles/engine';

export function ParticlesBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options: ISourceOptions = useMemo(
    () => ({
      fullScreen: false,
      background: {
        color: {
          value: 'transparent',
        },
      },
      fpsLimit: 60,
      interactivity: {
        events: {
          resize: {
            enable: true,
          },
        },
      },
      particles: {
        color: {
          value: '#ffffff',
        },
        links: {
          enable: false,
        },
        move: {
          enable: true,
          direction: 'outside',
          center: {
            x: 50,
            y: 50,
            mode: 'percent',
          },
          outModes: {
            default: 'out',
          },
          speed: { min: 0.3, max: 1.5 },
          straight: true,
        },
        number: {
          density: {
            enable: true,
            width: 1920,
            height: 1080,
          },
          value: 100,
        },
        opacity: {
          value: { min: 0.1, max: 0.4 },
        },
        shape: {
          type: 'circle',
        },
        size: {
          value: { min: 0.5, max: 1.5 },
        },
      },
      detectRetina: true,
    }),
    []
  );

  if (!init) return null;

  return (
    <Particles
      id="tsparticles"
      options={options}
      className="!fixed inset-0 z-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    />
  );
}

