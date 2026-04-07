import { useFrame, Fill, interpolate } from '@rendiv/core';

export const BasicFade = () => {
  const frame = useFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1]);

  return (
    <Fill style={{ background: '#0f0f0f', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{
        opacity,
        color: 'white',
        fontSize: 80,
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif'
      }}>
        Hello, CodeVideo!
      </h1>
    </Fill>
  );
};