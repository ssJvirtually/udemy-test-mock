import confetti from 'canvas-confetti';

export function firePassConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 }
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#a435f0', '#5624d0', '#5022c3']
  });
  fire(0.2, {
    spread: 60,
    colors: ['#1e7e34', '#2e7d32', '#107c41']
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    colors: ['#f4c150', '#b4690e']
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45
  });
}
